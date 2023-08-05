export const textFieldValidator = (value,length)=>{
  if (value.trim()===''){
    return false;
  }else return value.length >= length
};

export const numberValidator = (value) => {
  const regex = /^\d+$/;
  return value.match(regex)
};

export const emailValidator = (value) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return value.match(emailRegex)
};
