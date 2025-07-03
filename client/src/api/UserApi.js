const BASE_URL = "http://localhost:3000";

export const userSignup = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json(formData);

    if (response.ok) {
      return {
        success: true,
        message: "account created",
      };
    } else {
      return {
        success: false,
        message: "something went wrong when signing up.",
      };
    }
  } catch (error) {
    console.log("signing up error: ", error);
  }
};


export const userLogin = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "login was successful created",
        user: data 
      };
    } else {
      return {
        success: false,
        message: "something went wrong when logging in.",
      };
    }
  } catch (error) {
    console.log("Logging in error: ", error);
  }
};

