export function toCamelCase(value:string) {  
  return value.split("-").reduce((acc, v, index) => {
    acc += index === 0 ? v :upperCaseFirstLetter(v);
    return acc;
  }, "");
}

export function toPascalCase(value: string) {
  return value.split("-").reduce((acc, v) => {
    acc += upperCaseFirstLetter(v);
    return acc;
  }, "");
}

function upperCaseFirstLetter(value: string) {
  return value.substr(0, 1).toUpperCase() + value.substr(1);
}
