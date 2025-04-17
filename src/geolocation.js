const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  
  function success(pos) {
    const crd = pos.coords;
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

//   module.exports = {
//     success,
//     error,
//     options,
//   };