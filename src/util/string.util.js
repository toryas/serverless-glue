export function toPascalCase(str){
  return str.toLowerCase().replace(/([-_ ][a-z])|(^[a-zA-Z])/g, group =>{
    return group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
      .replace(' ', '') 
  })
}