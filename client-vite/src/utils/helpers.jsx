export const getLoggedinUserName = (user) => {
  if (user.userType === "donor") {
    return "Αιμοδότη";
  } else if (user.userType === "hospital") {
    return "Νοσοκομείο";
  } else if (user.userType === "organization") {
    return "Οργανισμός";
  }
};

export const getAntdInputValidation = () => {
  return [
    {
      required: true,
      message: "Required",
    },
  ];
};
