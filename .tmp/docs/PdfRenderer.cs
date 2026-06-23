using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

class PdfRenderer {
  const int W=1240, H=1754, M=92, Bottom=105;
  static readonly Color Ink=Color.FromArgb(23,49,66), Muted=Color.FromArgb(82,113,127), Brand=Color.FromArgb(233,87,47), Cyan=Color.FromArgb(8,127,154), Soft=Color.FromArgb(237,245,247), Navy=Color.FromArgb(7,21,34);
  List<Bitmap> pages=new List<Bitmap>(); Bitmap bmp; Graphics g; float y; bool rtl; int pageNo; string lang;
  Font body, h2, h3, h4, mono, small, tableFont;
  StringFormat fmt, fmtLtr;

  PdfRenderer(bool isRtl) {
    rtl=isRtl; lang=rtl?"FA":"EN";
    body=new Font(rtl?"Tahoma":"Segoe UI",18,FontStyle.Regular,GraphicsUnit.Pixel);
    h2=new Font(rtl?"Tahoma":"Segoe UI",34,FontStyle.Bold,GraphicsUnit.Pixel);
    h3=new Font(rtl?"Tahoma":"Segoe UI",25,FontStyle.Bold,GraphicsUnit.Pixel);
    h4=new Font(rtl?"Tahoma":"Segoe UI",21,FontStyle.Bold,GraphicsUnit.Pixel);
    mono=new Font("Consolas",14,FontStyle.Regular,GraphicsUnit.Pixel); small=new Font(rtl?"Tahoma":"Segoe UI",14,FontStyle.Regular,GraphicsUnit.Pixel); tableFont=new Font(rtl?"Tahoma":"Segoe UI",13,FontStyle.Regular,GraphicsUnit.Pixel);
    // DirectionRightToLeft makes Near the visual right edge.
    fmt=new StringFormat(StringFormat.GenericTypographic); fmt.Alignment=StringAlignment.Near; fmt.LineAlignment=StringAlignment.Near; if(rtl) fmt.FormatFlags|=StringFormatFlags.DirectionRightToLeft;
    fmtLtr=new StringFormat(StringFormat.GenericTypographic); fmtLtr.Alignment=StringAlignment.Near;
  }

  void NewPage(bool header=true) {
    bmp=new Bitmap(W,H,PixelFormat.Format24bppRgb); bmp.SetResolution(150,150); g=Graphics.FromImage(bmp); g.SmoothingMode=SmoothingMode.AntiAlias; g.TextRenderingHint=System.Drawing.Text.TextRenderingHint.ClearTypeGridFit; g.Clear(Color.White); pages.Add(bmp); pageNo++;
    if(header) { using(var p=new Pen(Color.FromArgb(215,231,236),2)) g.DrawLine(p,M,64,W-M,64); using(var b=new SolidBrush(Muted)) { var sf=new StringFormat(); sf.Alignment=StringAlignment.Near; if(rtl)sf.FormatFlags|=StringFormatFlags.DirectionRightToLeft; g.DrawString(rtl?BidiText("مستندات بک‌اند World Karate"):"WORLD KARATE · BACKEND GUIDE",small,b,new RectangleF(M,28,W-2*M,28),sf); var nsf=new StringFormat(); nsf.Alignment=rtl?StringAlignment.Near:StringAlignment.Far; g.DrawString(pageNo.ToString(),small,b,rtl?new RectangleF(M,28,80,28):new RectangleF(M,28,W-2*M,28),nsf); } }
    y=header?94:0;
  }
  void Ensure(float need) { if(y+need>H-Bottom) NewPage(); }
  static string BidiText(string s) {
    return Regex.Replace(s,@"[\x21-\x7E]+",m=>"\u200E"+m.Value+"\u200E");
  }
  string Clean(string s) {
    s=Regex.Replace(s,@"!\[([^\]]*)\]\([^)]+\)","$1"); s=Regex.Replace(s,@"\[([^\]]+)\]\([^)]+\)","$1"); s=s.Replace("**","").Replace("`","").Replace("<br>"," ").Replace("  "," ").Trim(); return rtl?BidiText(s):s;
  }
  float Measure(string text,Font f,float width,StringFormat sf) { return g.MeasureString(text,f,new SizeF(width,10000),sf).Height; }
  void DrawText(string text,Font f,Color color,float gap=13,float indent=0,StringFormat use=null) {
    text=Clean(text); if(text.Length==0)return; var sf=use??fmt; float width=W-2*M-indent; float hh=Measure(text,f,width,sf)+4; Ensure(hh+gap); using(var b=new SolidBrush(color)) g.DrawString(text,f,b,new RectangleF(M+(rtl?0:indent),y,width,hh),sf); y+=hh+gap;
  }
  void Heading(string text,int level) {
    Font f=level==2?h2:level==3?h3:h4; Color c=level==2?Ink:(level==3?Cyan:Brand); float hh=Measure(Clean(text),f,W-2*M,fmt)+18;
    if(level==2 && y>H-Bottom-430) NewPage(); else Ensure(hh+18);
    using(var b=new SolidBrush(c)) g.DrawString(Clean(text),f,b,new RectangleF(M,y,W-2*M,hh),fmt); y+=hh;
    if(level==2) { using(var p=new Pen(Color.FromArgb(205,225,231),3)) g.DrawLine(p,M,y,W-M,y); y+=20; } else y+=8;
  }
  void Paragraph(string text) { DrawText(text,body,Ink,14); }
  void ListItem(string text,bool numbered=false,string number="") {
    text=Clean(text); float width=W-2*M-42; float hh=Measure(text,body,width,fmt)+4; Ensure(hh+10);
    using(var b=new SolidBrush(Ink)) {
      string mark=numbered&&number.Length>0?number+".":"•";
      if(rtl) { g.DrawString(text,body,b,new RectangleF(M,y,width,hh),fmt); var mf=new StringFormat(); mf.Alignment=StringAlignment.Far; g.DrawString(mark,body,b,new RectangleF(W-M-36,y,36,hh),mf); }
      else { g.DrawString(mark,body,b,new RectangleF(M,y,30,hh),fmtLtr); g.DrawString(text,body,b,new RectangleF(M+38,y,width,hh),fmtLtr); }
    }
    y+=hh+10;
  }
  void Quote(string text) {
    text=Clean(text); float hh=Measure(text,body,W-2*M-48,fmt)+32; Ensure(hh+15); using(var b=new SolidBrush(Soft))g.FillRectangle(b,M,y,W-2*M,hh); using(var b=new SolidBrush(Brand))g.FillRectangle(b,rtl?W-M-7:M,y,7,hh); using(var b=new SolidBrush(Muted))g.DrawString(text,body,b,new RectangleF(M+24,y+15,W-2*M-48,hh-22),fmt); y+=hh+18;
  }
  void Code(List<string> lines) {
    string text=string.Join("\n",lines); float hh=Measure(text,mono,W-2*M-38,fmtLtr)+34; if(hh>H-Bottom-110)hh=H-Bottom-110; Ensure(hh+16); using(var b=new SolidBrush(Color.FromArgb(13,39,54)))g.FillRectangle(b,M,y,W-2*M,hh); using(var b=new SolidBrush(Color.FromArgb(217,237,242)))g.DrawString(text,mono,b,new RectangleF(M+19,y+16,W-2*M-38,hh-25),fmtLtr); y+=hh+18;
  }
  List<string> Cells(string row){ return row.Trim().Trim('|').Split('|').Select(Clean).ToList(); }
  void Table(List<string> rows) {
    if(rows.Count<2)return; var data=new List<List<string>>{Cells(rows[0])}; for(int i=2;i<rows.Count;i++)data.Add(Cells(rows[i])); int cols=data.Max(r=>r.Count); float tw=W-2*M, cw=tw/cols;
    foreach(var row in data.Select((v,i)=>new{v,i})) { float rh=38; for(int c=0;c<row.v.Count;c++)rh=Math.Max(rh,Measure(row.v[c],tableFont,cw-18,fmt)+17); if(rh>150)rh=150; Ensure(rh); bool head=row.i==0; using(var b=new SolidBrush(head?Color.FromArgb(18,57,75):(row.i%2==0?Soft:Color.White)))g.FillRectangle(b,M,y,tw,rh); for(int c=0;c<cols;c++){ int visual=rtl?cols-1-c:c; float x=M+visual*cw; using(var p=new Pen(Color.FromArgb(198,219,225),1))g.DrawRectangle(p,x,y,cw,rh); if(c<row.v.Count)using(var b=new SolidBrush(head?Color.White:Ink))g.DrawString(row.v[c],head?new Font(tableFont,FontStyle.Bold):tableFont,b,new RectangleF(x+9,y+8,cw-18,rh-12),fmt); } y+=rh; }
    y+=17;
  }
  void Cover(string title) {
    NewPage(false); using(var br=new LinearGradientBrush(new Rectangle(0,0,W,H),Navy,Color.FromArgb(20,61,80),55))g.FillRectangle(br,0,0,W,H);
    using(var p=new Pen(Color.FromArgb(35,121,155,170),3)){g.DrawEllipse(p,W-390,-170,550,550);g.DrawEllipse(p,W-470,-250,710,710);} using(var b=new SolidBrush(Color.FromArgb(121,212,228)))g.DrawString("WORLD KARATE · BACKEND",new Font("Segoe UI",18,FontStyle.Bold),b,new PointF(M,300));
    var cf=new Font(rtl?"Tahoma":"Segoe UI",58,FontStyle.Bold,GraphicsUnit.Pixel); var sf=new StringFormat(fmt); using(var b=new SolidBrush(Color.White))g.DrawString(title,cf,b,new RectangleF(M,390,W-2*M,330),sf);
    string sub=rtl?"راهنمای جامع معماری، API، داده، امنیت و استقرار":"Complete architecture, API, data, security, and deployment guide"; using(var b=new SolidBrush(Color.FromArgb(215,237,242)))g.DrawString(sub,new Font(rtl?"Tahoma":"Segoe UI",27),b,new RectangleF(M,730,W-2*M,150),sf); using(var b=new SolidBrush(Brand))g.FillRectangle(b,rtl?W-M-150:M,905,150,6);
    string edition=rtl?"نسخهٔ ۱٫۰ · استخراج‌شده از کد موجود · ژوئن ۲۰۲۶":"Edition 1.0 · Derived from the current codebase · June 2026"; using(var b=new SolidBrush(Color.FromArgb(170,203,212)))g.DrawString(edition,small,b,new RectangleF(M,H-190,W-2*M,50),sf);
  }
  void Arrow(float x1,float yy1,float x2,float yy2,Color c) { using(var p=new Pen(c,4)){p.CustomEndCap=new AdjustableArrowCap(7,8);g.DrawLine(p,x1,yy1,x2,yy2);} }
  void Box(float x,float yy,float ww,float hh,string title,string text,Color color) { using(var b=new SolidBrush(Color.FromArgb(18,55,73)))g.FillRectangle(b,x,yy,ww,hh); using(var p=new Pen(color,3))g.DrawRectangle(p,x,yy,ww,hh); using(var b=new SolidBrush(Color.White))g.DrawString(title,new Font("Segoe UI",21,FontStyle.Bold),b,new RectangleF(x+18,yy+16,ww-36,35),fmtLtr); using(var b=new SolidBrush(Color.FromArgb(210,233,239)))g.DrawString(text,new Font("Segoe UI",13),b,new RectangleF(x+18,yy+60,ww-36,hh-70),fmtLtr); }
  void Diagram(string name) {
    NewPage(); g.Clear(Navy); string diagramTitle=name.Contains("entity")?(rtl?"نمودار ارتباط موجودیت‌ها":"Entity Relationship Diagram"):name.Contains("payment")?(rtl?"چرخهٔ خرید و تأیید پرداخت":"Course Purchase and Verification"):(rtl?"معماری اجرایی":"Runtime Architecture"); var diagramFormat=new StringFormat(); diagramFormat.Alignment=rtl?StringAlignment.Far:StringAlignment.Near; using(var b=new SolidBrush(Color.White))g.DrawString(diagramTitle,new Font(rtl?"Tahoma":"Segoe UI",34,FontStyle.Bold),b,new RectangleF(M,90,W-2*M,70),diagramFormat); using(var b=new SolidBrush(Brand))g.FillRectangle(b,rtl?W-M-145:M,172,145,5);
    if(name.Contains("system")) Architecture(); else if(name.Contains("entity")) ER(); else Payment();
  }
  void Architecture(){
    Box(70,300,230,190,"Web client","JSON + auth cookie\nPayment navigation",Cyan); Box(405,230,450,500,"Express + TypeScript","CORS · Helmet · parsers\n\nJWT and admin guards\n\nAuth · Courses · Payment\nNewsletter · Profile",Brand); Box(950,250,230,230,"PostgreSQL","Prisma ORM\nUsers · Courses\nTransactions · Ownership",Cyan); Box(950,590,230,230,"Zarinpal","Create authority\nHosted gateway\nVerify payment",Color.FromArgb(251,191,36)); Arrow(300,395,405,395,Color.LightBlue); Arrow(855,360,950,360,Color.LightBlue); Arrow(855,680,950,680,Color.LightBlue);
    using(var b=new SolidBrush(Color.FromArgb(190,218,225)))g.DrawString("Database state is authoritative for identity, roles, prices, and course ownership.",new Font("Segoe UI",18),b,new RectangleF(70,930,1110,80),fmtLtr);
  }
  void Entity(float x,float yy,float ww,float hh,string title,string[] fields,Color color){using(var b=new SolidBrush(Color.FromArgb(18,52,71)))g.FillRectangle(b,x,yy,ww,hh);using(var b=new SolidBrush(color))g.FillRectangle(b,x,yy,ww,52);float titleSize=title.Length>18?12:title.Length>14?14:17;using(var b=new SolidBrush(Color.White))g.DrawString(title,new Font("Segoe UI",titleSize,FontStyle.Bold),b,new RectangleF(x+13,yy+12,ww-26,32),fmtLtr);using(var b=new SolidBrush(Color.FromArgb(220,238,242)))g.DrawString(string.Join("\n",fields),new Font("Consolas",12),b,new RectangleF(x+13,yy+68,ww-26,hh-78),fmtLtr);}
  void ER(){
    Entity(55,220,270,390,"User",new[]{"PK id Int","UQ email String","password String","verified Boolean","verificationKey String","OTP Int?","isAdmin Boolean","createdAt / updatedAt"},Brand); Entity(455,270,290,250,"UsersOnCourses",new[]{"PK/FK userId Int","PK/FK courseId Int","createdAt / updatedAt","","Purchased ownership"},Cyan); Entity(875,220,270,330,"Course",new[]{"PK id Int","title String","description String","price Int (IRR)","img String","link String?","previewLinks String[]"},Brand); Arrow(325,365,455,365,Color.LightBlue);Arrow(745,365,875,365,Color.LightBlue);
    Entity(220,850,280,310,"Transaction",new[]{"PK id Int","FK userId Int","isPaid Boolean","UQ transactionId","UQ authority","totalPrice Int"},Color.FromArgb(5,150,105)); Entity(700,850,320,250,"TransactionsOnCourses",new[]{"PK/FK transactionId","PK/FK courseId","createdAt / updatedAt","","Checkout contents"},Cyan); Arrow(360,610,360,850,Color.LightBlue);Arrow(500,970,700,970,Color.LightBlue);Arrow(1010,550,860,850,Color.LightBlue);
    Entity(55,710,270,160,"Newsletter",new[]{"PK id Int","UQ email String","Independent subscriber list"},Color.FromArgb(124,58,237));
  }
  void Life(float x,string actor){using(var b=new SolidBrush(Color.FromArgb(18,57,75)))g.FillRectangle(b,x-105,180,210,55);using(var b=new SolidBrush(Color.White))g.DrawString(actor,new Font("Segoe UI",12,FontStyle.Bold),b,new RectangleF(x-98,196,196,30),new StringFormat{Alignment=StringAlignment.Center});using(var p=new Pen(Color.FromArgb(77,120,136),2)){p.DashStyle=DashStyle.Dash;g.DrawLine(p,x,235,x,1500);}}
  void Msg(float from,float to,float yy,string text,bool ret=false){Arrow(from,yy,to,yy,ret?Color.FromArgb(251,191,36):Color.LightBlue);using(var b=new SolidBrush(Color.FromArgb(220,238,242)))g.DrawString(text,new Font("Segoe UI",11),b,new RectangleF(Math.Min(from,to)+8,yy-30,Math.Abs(to-from)-16,26),fmtLtr);}
  void Payment(){ float a=135,b=435,c=735,d=1035;Life(a,"Client");Life(b,"Express API");Life(c,"PostgreSQL");Life(d,"Zarinpal"); Msg(a,b,300,"1  Checkout courseIds");Msg(b,c,400,"2  Load prices + ownership");Msg(c,b,475,"canonical basket",true);Msg(b,d,580,"3  Create payment");Msg(d,b,655,"authority",true);Msg(b,c,750,"4  Insert unpaid transaction");Msg(b,a,840,"paymentUrl + authority",true);Msg(a,b,990,"5  Verify authority");Msg(b,d,1085,"stored total + authority");Msg(d,b,1160,"code 100 + ref_id",true);Msg(b,c,1260,"6  Mark paid; grant courses");using(var bb=new SolidBrush(Color.FromArgb(15,118,110)))g.FillRectangle(bb,270,1370,710,80);using(var bb=new SolidBrush(Color.White))g.DrawString("Already paid: return success; do not grant twice.",new Font("Segoe UI",13),bb,new RectangleF(290,1392,670,42),fmtLtr); }

  void Render(string mdPath,string pdfPath) {
    var lines=File.ReadAllLines(mdPath,Encoding.UTF8).ToList(); string firstTitle=lines.FirstOrDefault(x=>x.StartsWith("# ")); string title=firstTitle==null?"World Karate Backend":firstTitle.Substring(2); Cover(title); NewPage();
    var para=new List<string>(); Action flush=()=>{if(para.Count>0){Paragraph(string.Join(" ",para));para.Clear();}};
    bool code=false;var codeLines=new List<string>();
    for(int i=0;i<lines.Count;i++) { string line=lines[i]; string t=line.Trim(); if(t.StartsWith("<div")||t=="</div>"||t.StartsWith("# "))continue;
      if(t.StartsWith("```")){flush();if(code){Code(codeLines);codeLines.Clear();code=false;}else code=true;continue;} if(code){codeLines.Add(line);continue;}
      if(t.StartsWith("![")){flush();var mm=Regex.Match(t,@"\(([^)]+)\)");Diagram(mm.Success?mm.Groups[1].Value:t);NewPage();continue;}
      if(t.StartsWith("## ")){flush();int next=i+1;while(next<lines.Count&&lines[next].Trim().Length==0)next++;if(next<lines.Count&&lines[next].Trim().StartsWith("!["))continue;Heading(t.Substring(3),2);continue;} if(t.StartsWith("### ")){flush();Heading(t.Substring(4),3);continue;} if(t.StartsWith("#### ")){flush();Heading(t.Substring(5),4);continue;}
      if(t.StartsWith("> ")){flush();var q=new List<string>();while(i<lines.Count&&lines[i].Trim().StartsWith("> ")){q.Add(lines[i].Trim().Substring(2));i++;}i--;Quote(string.Join(" ",q));continue;}
      if(t.Contains("|")&&i+1<lines.Count&&Regex.IsMatch(lines[i+1],@"^\s*\|?\s*:?-+")){flush();var rows=new List<string>{line,lines[++i]};while(i+1<lines.Count&&lines[i+1].Contains("|")&&lines[i+1].Trim().Length>0)rows.Add(lines[++i]);Table(rows);continue;}
      if(Regex.IsMatch(t,@"^[-*]\s+")){flush();ListItem(Regex.Replace(t,@"^[-*]\s+",""));continue;} if(Regex.IsMatch(t,@"^(\d+|[۰-۹]+)[.)]\s+")){flush();var nm=Regex.Match(t,@"^(\d+|[۰-۹]+)").Value;ListItem(Regex.Replace(t,@"^(\d+|[۰-۹]+)[.)]\s+",""),true,nm);continue;}
      if(t=="---"){flush();Ensure(25);using(var p=new Pen(Color.LightGray,2))g.DrawLine(p,M,y,W-M,y);y+=25;continue;} if(t.Length==0){flush();continue;} para.Add(t);
    } flush(); SavePdf(pdfPath);
  }
  void SavePdf(string path){ var jpgs=new List<byte[]>();foreach(var p in pages){using(var ms=new MemoryStream()){var enc=ImageCodecInfo.GetImageEncoders().First(x=>x.MimeType=="image/jpeg");var ep=new EncoderParameters(1);ep.Param[0]=new EncoderParameter(System.Drawing.Imaging.Encoder.Quality,90L);p.Save(ms,enc,ep);jpgs.Add(ms.ToArray());}p.Dispose();}
    using(var s=new FileStream(path,FileMode.Create,FileAccess.Write)){var offs=new List<long>{0};Action<string> wr=x=>{var z=Encoding.ASCII.GetBytes(x);s.Write(z,0,z.Length);};wr("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");int n=2+jpgs.Count*3;Action<int,string> obj=(id,x)=>{offs.Add(s.Position);wr(id+" 0 obj\n"+x+"\nendobj\n");};obj(1,"<< /Type /Catalog /Pages 2 0 R >>");string kids=string.Join(" ",Enumerable.Range(0,jpgs.Count).Select(i=>(3+i*3)+" 0 R"));obj(2,"<< /Type /Pages /Kids [ "+kids+" ] /Count "+jpgs.Count+" >>");for(int i=0;i<jpgs.Count;i++){int pg=3+i*3,ct=pg+1,im=pg+2;obj(pg,"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 "+im+" 0 R >> >> /Contents "+ct+" 0 R >>");string cmd="q 595 0 0 842 0 0 cm /Im0 Do Q";obj(ct,"<< /Length "+cmd.Length+" >>\nstream\n"+cmd+"\nendstream");offs.Add(s.Position);wr(im+" 0 obj\n<< /Type /XObject /Subtype /Image /Width "+W+" /Height "+H+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+jpgs[i].Length+" >>\nstream\n");s.Write(jpgs[i],0,jpgs[i].Length);wr("\nendstream\nendobj\n");}long xr=s.Position;wr("xref\n0 "+(n+1)+"\n0000000000 65535 f \n");foreach(long o in offs.Skip(1))wr(o.ToString("0000000000")+" 00000 n \n");wr("trailer\n<< /Size "+(n+1)+" /Root 1 0 R >>\nstartxref\n"+xr+"\n%%EOF\n");}
  }
  static void Main(string[] args){if(args.Length<3)throw new Exception("usage: PdfRenderer <en|fa> <markdown> <pdf>");new PdfRenderer(args[0].ToLower()=="fa").Render(args[1],args[2]);}
}
