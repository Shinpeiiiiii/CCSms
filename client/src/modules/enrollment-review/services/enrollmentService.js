import axios from "axios";

const API =
  "http://localhost:5173/student-applications";

export const getApplications =
  async () => {
    const response =
      await axios.get(API);

    return response.data;
  };

export const updateApplicationStatus =
  async (
    id,
    status
  ) => {
    const response =
      await axios.put(
        `${API}/${id}`,
        {
          status,
        }
      );

    return response.data;
  };