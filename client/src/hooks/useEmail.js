import React, { useState } from "react";

const useEmail = (initialValue) => {
  const [email, setEmail] = useState(initialValue || "");
  const emailStatus = false;

  const handleEmailChange = (value) => {

    // if (value.length > 4) {
    //   const regex = new RegExp(/^[0-9]{5}(?:-[0-9]{4})?$/);
    //   if (regex.test(value)) {
    //     setZipCode(value);
    //   }
    // } else {
    //   setZipCode(value);
    // }
    setEmail(value);
  };

  return [email, handleEmailChange, emailStatus];
};

export default useEmail;