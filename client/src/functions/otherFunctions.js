function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

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

export { getCookie, checkImageType, isObjId };
