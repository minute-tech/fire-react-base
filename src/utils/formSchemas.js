import * as yup from "yup";

export const contactFormSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email.")
      .required("Email is required.")      
      .max(150,"Email can be at most 150 characters long.")
      .min(2,"Email must be at least 2 characters long."),
    name: yup
      .string()
      .required("Your name is required.")
      .max(150,"Name can be at most 150 characters long.")
      .min(2,"Name must be at least 2 characters long."),
      body: yup
      .string()
      .required("A message body is required.")
      .max(30000,"Message body can be at most 30000 characters long.")
      .min(10,"Message body must be at least 10 characters long."),
})

export const userRegisterSchema = yup.object().shape({
    firstName: yup
        .string()
        .required("A first name is required.")
        .max(150,"Name can be at most 150 characters long.")
        .min(1,"Name must be at least 1 characters long."),
    lastName: yup
        .string()
        .required("A last name is required.")
        .max(150,"Name can be at most 150 characters long.")
        .min(1,"Name must be at least 1 characters long."),
    email: yup
      .string()
      .email("That is not a valid email address.")
      .max(150,"Email can be at most 150 characters long.")
      .min(3,"Email must be at least 3 characters long.")
      .required("Email is required."),
    password: yup
        .string()
        .required("Password is required.")
        .max(50, "Password can be a maximum of 50 characters.")
        .min(6, "Password must be a minimum than 6 characters."),
    confirmPassword: yup
        .string()
        .required("Password confirmation is required.")
        .max(50, "Password can be a maximum of 50 characters.")
        .min(6, "Password must be a minimum than 6 characters."),
});

export const updateProfileSchema = yup.object().shape({
    firstName: yup
        .string()
        .required("A first name is required.")
        .max(150,"Name can be at most 150 characters long.")
        .min(1,"Name must be at least 1 characters long."),
    lastName: yup
        .string()
        .required("A last name is required.")
        .max(150,"Name can be at most 150 characters long.")
        .min(1,"Name must be at least 1 characters long."),
    email: yup
      .string()
      .email("That is not a valid email address.")
      .max(150,"Email can be at most 150 characters long.")
      .min(3,"Email must be at least 3 characters long.")
      .required("Email is Required."),
    phone: yup
      .string()
      .max(25, "Phone number must be less than 25 characters.")
      .min(4, "Phone number must be more than 4 characters."),
});

export const signInSchema = yup.object().shape({
    email: yup
        .string()
        .email("That is not a valid email address.")
        .max(150,"Email can be at most 150 characters long.")
        .min(3,"Email must be at least 3 characters long.")
        .required("Email is required."),
    password: yup
        .string()
        .required("Password is required.")
        .max(50, "Password can be a maximum of 50 characters.")
        .min(6, "Password must be a minimum than 6 characters."),
});
