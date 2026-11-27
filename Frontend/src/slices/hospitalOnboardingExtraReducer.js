import {
  createDepartment,
  createDoctor,
  deleteDepartment,
  deleteDoctor,
  fetchBasicDetails,
  fetchDepartments,
  fetchDoctors,
  setUpPassword,
  signUpHospital,
  verifyToken,
  welcomeToHospital,
} from "./hospitalOnboardingSlice";
import { setDataInCookies } from "../services/cookies";
import { dobToAge } from "../utils/common";

const extraReducersFromHospitalOnboarding = (builder) => {
  builder.addCase(fetchBasicDetails.pending, (state) => {
    console.log("📡 fetchBasicDetails → pending...");
    state.fetchBasicDetailApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(fetchBasicDetails.fulfilled, (state, action) => {
    console.log("✅ fetchBasicDetails:", action.payload);
    state.fetchBasicDetailApi = {
      isLoading: false,
      status: "success",
      data: action.payload.response,
    };
    state.signUpHospitalApi.hospitalId = action.payload.response._id;
    state.formData.basicDetails = {
      ...state.formData.basicDetails,
      ...action.payload.response,
    };
  });
  builder.addCase(fetchBasicDetails.rejected, (state, action) => {
    console.log("❌ fetchBasicDetails → rejected:", action.payload);
    state.fetchBasicDetailApi = {
      isLoading: false,
      status: "failed",
    };
  });

  builder.addCase(signUpHospital.pending, (state) => {
    console.log("📡 signUpHospital → pending...");
    state.signUpHospitalApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(signUpHospital.fulfilled, (state, action) => {
    console.log("✅ signUpHospital:", action.payload);
    state.signUpHospitalApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
    setDataInCookies("hospitalToken", action.payload.token);
  });

  builder.addCase(signUpHospital.rejected, (state, action) => {
    console.log("❌ signUpHospital → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.signUpHospitalApi = {
      isLoading: false,
      status: "failed",
      error: error,
    };
  });

  //for departments
  builder.addCase(fetchDepartments.pending, (state) => {
    console.log("📡 fetchDepartments → pending...");
    state.departmentsIsLoading = true;
    state.departmentsStatus = "pending";
  });
  builder.addCase(fetchDepartments.fulfilled, (state, action) => {
    console.log("✅ Fetched departments:", action.payload);
    state.departmentsIsLoading = false;
    state.departmentsStatus = "success";
    state.formData.departments = action.payload.response.list.map((ele) => ({
      name: ele.name,
      id: ele._id,
      code: ele.code,
      active: ele.active,
    }));
  });
  builder.addCase(fetchDepartments.rejected, (state, action) => {
    console.log("❌ fetchDepartments → rejected:", action.error.message);
    state.departmentsIsLoading = false;
    state.departmentsStatus = "failed";
  });

  // for Doctors
  builder.addCase(fetchDoctors.pending, (state) => {
    state.doctorsIsLoading = true;
    state.doctorsStatus = "pending";
  });
  builder.addCase(fetchDoctors.fulfilled, (state, action) => {
    state.doctorsIsLoading = false;
    state.doctorsStatus = "success";
    state.formData.doctors = action.payload.response.list.map((ele) => ({
      name: ele.name,
      id: ele.userId,
      code: ele.code,
      active: ele.active,
      gender: ele.gender,
      qualifications: ele.qualifications,
      age: dobToAge(ele.dateOfBirth),
      dateOfBirth: ele.dateOfBirth,
      type: ele.type,
      departmentName: ele?.departmentData?.name || "Not Assigned",
      phoneNo: ele.phoneNo,
      email: ele.email,
    }));
  });
  builder.addCase(fetchDoctors.rejected, (state, action) => {
    console.log("❌ fetchDoctors → rejected:", action.error.message);
    state.doctorsIsLoading = false;
    state.doctorsStatus = "failed";
    // const error = JSON.parse(action.error.message);
  });

  //for create department
  builder.addCase(createDepartment.pending, (state) => {
    console.log("📡 createDepartment → pending...");
    state.createDeptApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(createDepartment.fulfilled, (state, action) => {
    console.log("✅ createDepartment:", action.payload);
    state.createDeptApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
  });
  builder.addCase(createDepartment.rejected, (state, action) => {
    console.log("❌ createDepartment → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.createDeptApi = {
      isLoading: false,
      status: "failed",
      error,
    };
  });

  builder.addCase(deleteDepartment.pending, (state) => {
    console.log("📡 deleteDepartment → pending...");
    state.deleteDeptApi = {
      isLoading: true,
      status: "pending",
    };
  });

  builder.addCase(deleteDepartment.fulfilled, (state, action) => {
    console.log("✅ deleteDepartment:", action.payload);
    state.deleteDeptApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
  });

  builder.addCase(deleteDepartment.rejected, (state, action) => {
    console.log("❌ deleteDepartment → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.deleteDeptApi = {
      isLoading: false,
      status: "failed",
      error,
    };
  });

  //for create doctor
  builder.addCase(createDoctor.pending, (state) => {
    console.log("📡 createDoctor → pending...");
    state.createDoctorApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(createDoctor.fulfilled, (state, action) => {
    console.log("✅ createDoctor:", action.payload);
    state.createDoctorApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
  });
  builder.addCase(createDoctor.rejected, (state, action) => {
    console.log("❌ createDoctor → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.createDoctorApi = {
      isLoading: false,
      status: "failed",
      error,
    };
  });

  // For deleteDoctor
  builder.addCase(deleteDoctor.pending, (state) => {
    console.log("📡 deleteDoctor → pending...");
    state.deleteDoctorApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(deleteDoctor.fulfilled, (state, action) => {
    console.log("✅ deleteDoctor:", action.payload);
    state.deleteDoctorApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
  });
  builder.addCase(deleteDoctor.rejected, (state, action) => {
    console.log("❌ deleteDoctor → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.deleteDoctorApi = {
      isLoading: false,
      status: "failed",
      error,
    };
  });

  // For welcomeToHospital
  builder.addCase(welcomeToHospital.pending, (state) => {
    console.log("📡 welcomeToHospital → pending...");
    state.welcomeToHospitalApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(welcomeToHospital.fulfilled, (state, action) => {
    console.log("✅ welcomeToHospital:", action.payload);
    state.welcomeToHospitalApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
  });
  builder.addCase(welcomeToHospital.rejected, (state, action) => {
    console.log("❌ welcomeToHospital → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.welcomeToHospitalApi = {
      isLoading: false,
      status: "failed",
      error,
    };
  });

  // For verifyToken
  builder.addCase(verifyToken.pending, (state) => {
    console.log("📡 verifyToken → pending...");
    state.verifyTokenApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(verifyToken.fulfilled, (state, action) => {
    console.log("✅ verifyToken:", action.payload);
    state.verifyTokenApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
  });
  builder.addCase(verifyToken.rejected, (state, action) => {
    console.log("❌ verifyToken → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.verifyTokenApi = {
      isLoading: false,
      status: "failed",
      error,
    };
  });

  // For setUpPassword
  builder.addCase(setUpPassword.pending, (state) => {
    console.log("📡 setUpPassword → pending...");
    state.setUpPasswordApi = {
      isLoading: true,
      status: "pending",
    };
  });
  builder.addCase(setUpPassword.fulfilled, (state, action) => {
    console.log("✅ setUpPassword:", action.payload);
    state.setUpPasswordApi = {
      isLoading: false,
      status: "success",
      data: action.payload,
    };
  });
  builder.addCase(setUpPassword.rejected, (state, action) => {
    console.log("❌ setUpPassword → rejected:", action.error.message);
    const error = JSON.parse(action.error.message);
    state.setUpPasswordApi = {
      isLoading: false,
      status: "failed",
      error,
    };
  });
};

export default extraReducersFromHospitalOnboarding;
