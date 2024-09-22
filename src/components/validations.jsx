import * as Yup from "yup";

export const productValidation = Yup.object({
  name: Yup.string().min(3).required("Please enter name"),
  description: Yup.string().min(3),
  barcode: Yup.string().min(3),
  cost_price: Yup.number()
    .min(0.01, "Ammount be greater than 0")
    .required("Enter amount")
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero (0)"),
  selling_price: Yup.number()
    .min(0.01, "Ammount be greater than 0")
    .required("Enter amount")
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero (0)"),
});
export const userValidations = Yup.object({
  firstName: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .required("Please enter a name"),
  lastName: Yup.string()
    .min(3, "Last name must be at lease 3 characters long")
    .required("Please enter last name"),
  id_number: Yup.string()
    .min(6, "Must be 6 character or more")
    .required("Enter an ID number"),
  mobile_number: Yup.string()
    .matches(/^\+\d{12}$/, "Please enter a phone number (+#)############")
    .required("Please enter a mobile number"),
  username: Yup.string()
    .min(3, "must be 3 characters or more")
    .required("Enter a username"),
  password: Yup.string()
    .min(6, "must be 6 characters or more")
    .required("Enter a password"),
  // repassword: Yup.string().required("Re-enter the password"),
});

export const idValidations = Yup.object({
  id_type: Yup.string()
    .min(2, "ID type must be at least 2 characters long")
    .required("Please enter an ID type"),
});

export const receipientValidation = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters or more")
    .required("Please enter a receipient name"),
  additional: Yup.string(),
});
//phone: Yup.string().matches(/^\+\d{12}$/, "Please number must be in the format +233#########").required("Enter phone number"),

export const userValidation = Yup.object({
  username: Yup.string()
    .min(2, "Name must be at least 2 characters or more")
    .required("Please enter a username"),
  password: Yup.string().required("Password cannot be empty"),
});
