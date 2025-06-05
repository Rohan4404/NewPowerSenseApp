import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { onboard } from "../api/Service"; // Ensure correct path to onboard API function

const { width, height } = Dimensions.get("window");

const RegisterModal = ({ onClose, setApiCall }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await onboard(data);
      if (response && response.success) {
        Toast.show({
          type: "success",
          text1: response.message || "Registered successfully",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#FFFFFF",
          },
          style: {
            backgroundColor: "#009D9D",
            borderWidth: 1,
            borderColor: "#2BFFFF",
          },
        });
        await AsyncStorage.setItem("userId", response.user?.id.toString());
        setTimeout(() => onClose(), 3000);
      } else {
        Toast.show({
          type: "error",
          text1: response?.error || "Registration failed",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#FFFFFF",
          },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `Error: ${error.message}`,
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
        topOffset: height * 0.05,
        text1Style: {
          fontSize: width * 0.04,
          color: "#FFFFFF",
        },
        style: {
          backgroundColor: "#000000",
          borderWidth: 1,
          borderColor: "#FF5555",
        },
      });
    } finally {
      setIsLoading(false);
      setApiCall((prev) => !prev);
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      <View style={styles.modal}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={width * 0.06} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.header}>Onboard a new organization</Text>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>
            Organization Details <Text style={styles.required}>*</Text>
          </Text>
          {[
            {
              name: "organization_name",
              placeholder: "Enter organization name",
              label: "Organization Name",
            },
            {
              name: "gst_no",
              placeholder: "Enter GST number",
              label: "GST No",
            },
            {
              name: "address",
              placeholder: "Enter address",
              label: "Address",
            },
            {
              name: "organization_type",
              label: "Organization Type",
              type: "select",
              options: [
                "Manufacturing",
                "Trading",
                "Hardware",
                "Software",
                "Agriculture",
                "Construction",
                "Retail",
                "Healthcare",
                "Education",
                "Monopoly",
              ],
            },
          ].map(({ name, placeholder, label, type = "text", options }) => (
            <View key={name} style={styles.inputContainer}>
              {type === "select" ? (
                <View style={styles.pickerContainer}>
                  <Controller
                    control={control}
                    name={name}
                    rules={{ required: `${label} is required` }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Picker
                          selectedValue={value}
                          onValueChange={onChange}
                          style={styles.picker}
                          itemStyle={styles.pickerItem}
                        >
                          <Picker.Item label={`Select ${label}`} value="" />
                          {options.map((opt) => (
                            <Picker.Item key={opt} label={opt} value={opt} />
                          ))}
                        </Picker>
                        <MaterialIcons
                          name="arrow-drop-down"
                          size={width * 0.05}
                          color="#FFFFFF"
                          style={styles.pickerIcon}
                        />
                      </>
                    )}
                  />
                </View>
              ) : (
                <Controller
                  control={control}
                  name={name}
                  rules={{ required: `${label} is required` }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder={placeholder}
                      placeholderTextColor="#D1D5DB"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType={
                        type === "email"
                          ? "email-address"
                          : type === "tel"
                          ? "phone-pad"
                          : "default"
                      }
                    />
                  )}
                />
              )}
              {errors[name] && (
                <Text style={styles.errorText}>{errors[name].message}</Text>
              )}
            </View>
          ))}
          <Text style={styles.sectionTitle}>
            Contact Details <Text style={styles.required}>*</Text>
          </Text>
          {[
            {
              name: "admin_name",
              placeholder: "Enter admin name",
              label: "Admin Name",
            },
            {
              name: "email",
              placeholder: "Enter email",
              label: "Email",
              type: "email",
            },
            {
              name: "phone_no",
              placeholder: "Enter phone number",
              label: "Phone Number",
              type: "tel",
            },
          ].map(({ name, placeholder, label, type = "text" }) => (
            <View key={name} style={styles.inputContainer}>
              <Controller
                control={control}
                name={name}
                rules={{ required: `${label} is required` }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#D1D5DB"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType={
                      type === "email"
                        ? "email-address"
                        : type === "tel"
                        ? "phone-pad"
                        : "default"
                    }
                  />
                )}
              />
              {errors[name] && (
                <Text style={styles.errorText}>{errors[name].message}</Text>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(55, 55, 55, 0.4)", // Match bg-[#37373766] with 50% opacity
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05, // Responsive padding
    zIndex: 50,
  },
  modal: {
    width: width * 0.9, // Match max-w-[22rem]
    minHeight: height * 0.5, // Match min-h-[50vh]
    backgroundColor: "#009D9D", // Solid color approximating radial gradient
    borderRadius: width * 0.03, // Match rounded-xl
    borderWidth: 2,
    borderColor: "#2BFFFF",
    padding: width * 0.04, // Responsive padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Match shadow-2xl
  },
  closeButton: {
    position: "absolute",
    top: height * 0.015, // Responsive positioning
    right: width * 0.03,
    padding: width * 0.02,
  },
  header: {
    fontSize: width * 0.055, // Match text-[21px]
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.015, // Match mb-2
  },
  form: {
    flexDirection: "column",
    alignItems: "center",
    gap: height * 0.015, // Match space-y-4
  },
  sectionTitle: {
    fontSize: width * 0.04, // Match text-[15px]
    fontWeight: "600",
    color: "#FFFFFF",
    alignSelf: "flex-start",
    paddingTop: height * 0.005, // Match pt-1
  },
  required: {
    color: "#FF5555",
  },
  inputContainer: {
    width: "100%",
    maxWidth: width * 0.9, // Match max-w-[600px]
  },
  input: {
    width: "100%",
    paddingHorizontal: width * 0.02, // Match px-3
    paddingVertical: height * 0.01, // Match py-2
    borderRadius: width * 0.03, // Match rounded-xl
    borderWidth: 1,
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
    fontSize: width * 0.04, // Match text-base
    backgroundColor: "transparent",
  },
  pickerContainer: {
    position: "relative",
    width: "100%",
  },
  picker: {
    width: "100%",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
  pickerItem: {
    fontSize: width * 0.04,
    color: Platform.OS === "ios" ? "#FFFFFF" : "#000000", // iOS picker items need white text, Android needs black
  },
  pickerIcon: {
    position: "absolute",
    right: width * 0.04, // Match right-6
    top: "50%",
    transform: [{ translateY: -height * 0.015 }],
  },
  errorText: {
    fontSize: width * 0.03, // Match text-xs
    color: "#FF5555",
    marginTop: height * 0.005, // Match mt-1
  },
  submitButton: {
    width: "100%",
    maxWidth: width * 0.9, // Match max-w-[600px]
    paddingVertical: height * 0.015, // Match py-3
    borderRadius: width * 0.03, // Match rounded-xl
    backgroundColor: "#00D1D1",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#6B7280", // Match bg-gray-500
  },
  submitButtonText: {
    fontSize: width * 0.05, // Match text-xl
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default RegisterModal;
