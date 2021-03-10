export const toFloat = text => {
  if (isInt(text) || isFloat(text)) {
    return text;
  } else {
    return parseFloat(text.toString().replace(/\./g, "").replace(/\,/g, "."));
  }
};

const isInt = n => {
  return Number(n) === n && n % 1 === 0;
};

const isFloat = n => {
  return Number(n) === n && n % 1 !== 0;
};

export const maskRealBeautify = value => {
  console.log(value);

  return toFloat(value)
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
};
