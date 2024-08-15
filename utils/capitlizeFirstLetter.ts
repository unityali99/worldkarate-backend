function capitalizeFirstLetter(rawString: string) {
  const string = rawString.toLowerCase().trim();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default capitalizeFirstLetter;
