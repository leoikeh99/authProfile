const checkImageType = (type) => {
  let imageTypes = ["image/jpg", "image/jpeg", "image/png"];
  let check = false;
  imageTypes.forEach((imageType) => {
    type === imageType && (check = true);
  });
  return check;
};

const isObjId = (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else {
    return false;
  }
};

export { checkImageType, isObjId };
