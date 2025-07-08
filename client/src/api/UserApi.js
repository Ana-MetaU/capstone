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

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "account created",
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong when signing up.",
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
    console.log("status", response);

    if (response.ok) {
      return {
        success: true,
        message: "login was successful created",
        user: data,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong when logging in lala.",
      };
    }
  } catch (error) {
    console.log("Logging in error: ", error);
  }
};

export const userAuthenticate = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok && data.id) {
      return {
        success: true,
        user: data,
      };
    } else {
      return {
        success: false,
        message: "User not authenticated",
      };
    }
  } catch (error) {
    console.log("error when authenticating user", error);
    return {
      success: false,
      message: "something went wrong when checking auth",
    };
  }
};
