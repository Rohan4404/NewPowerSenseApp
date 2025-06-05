//   login function
import axios from "axios";
import { apiURL, apiURL2, sensorURL, apiURL1 } from "./Client";

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${apiURL2}/client/login`, userData);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${apiURL}/register`, userData);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

export async function forgotPassword(email) {
  try {
    const response = await axios.post(`${apiURL1}/forgot-password`, {
      email: email,
    });

    return response.data; // Return the response data
  } catch (error) {
    // Optional: handle both server and network errors
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.message || "Server error");
    } else if (error.request) {
      // Request was made but no response
      throw new Error("No response from server");
    } else {
      // Something else went wrong
      throw new Error(error.message);
    }
  }
}
export const getAllUserEmails = async () => {
  try {
    const response = await axios.get(`${apiURL}/usersemails`);
    return response.data; // Expecting an array of emails or user objects with email field
  } catch (error) {
    return error.response?.data || { error: "Unable to fetch user emails" };
  }
};

export const addMachine = async (machineData) => {
  try {
    const response = await axios.post(
      `${apiURL2}/machine/register`,
      machineData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding machine:", error);
    return { success: false };
  }
};

export const addTable = async (tableData) => {
  try {
    const response = await axios.post(`${sensorURL}/register`, tableData);
    return response.data;
  } catch (error) {
    console.error("Error adding machine:", error);
    return { success: false };
  }
};

export const getAllMachines = async () => {
  try {
    const response = await axios.get(`${apiURL}/cards`);
    return response.data; // Expecting an array of emails or user objects with email field
  } catch (error) {
    return error.response?.data || { error: "Unable to fetch user emails" };
  }
};

export const usersmachines = async () => {
  try {
    const response = await axios.get(`${apiURL}/usersmachines`);
    return response.data; // Expecting an array of emails or user objects with email field
  } catch (error) {
    return error.response?.data || { error: "Unable to fetch user emails" };
  }
};

export const getUserRoleCards = async () => {
  try {
    const response = await axios.get(`${apiURL}/getUserRoleCards`);
    return response.data; // Expecting an array of emails or user objects with email field
  } catch (error) {
    return error.response?.data || { error: "Unable to fetch user emails" };
  }
};

export const getCardByID = async (userId) => {
  try {
    const response = await axios.get(`${apiURL}/cards/${userId}`);
    return response.data; // Expecting the card data for that userId
  } catch (error) {
    return error.response?.data || { error: "Unable to fetch user emails" };
  }
};

export const deleteMachine = async (email, title) => {
  try {
    const response = await axios.post(`${apiURL}/delete`, {
      email,
      title,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Unable to delete machine" };
  }
};

export const onboard = async (userData) => {
  try {
    const response = await axios.post(`${apiURL2}/client/onboard`, userData);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

export const getOnboardClient = async () => {
  try {
    const response = await axios.get(`${apiURL2}/client`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

// Send OTP to email or phone
export const signup = async (emailOrPhone) => {
  try {
    const response = await axios.post(`${apiURL2}/client/signup`, {
      emailOrPhone,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

// Verify OTP and submit full payload
export const verifyOtp = async ({ emailOrPhone, otp, password }) => {
  try {
    const response = await axios.post(`${apiURL2}/client/signup/verify-otp`, {
      emailOrPhone,
      otp,
      password,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

export const getAllClients = async () => {
  try {
    const response = await axios.get(`${apiURL2}/client`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

export const getMachinesByClientId = async (clientId) => {
  try {
    const response = await axios.get(`${apiURL2}/client/${clientId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

export const getMachineById = async (clientId) => {
  try {
    const response = await axios.get(`${apiURL2}/machine/${clientId}`);
    return response.data; // Expecting the card data for that userId
  } catch (error) {
    return error.response?.data || { error: "Unable to fetch user emails" };
  }
};
