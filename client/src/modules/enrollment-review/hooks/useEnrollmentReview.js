import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getApplications,
  updateApplicationStatus,
} from "../services/enrollmentService";

import {
  getEnrollmentStats,
} from "../utils/getEnrollmentStats";

import {
  filterApplications,
} from "../utils/filterApplications";

export default function
useEnrollmentReview() {

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    activeTab,
    setActiveTab,
  ] = useState("all");



  useEffect(() => {
    const fectApplications = async () =>{
        try{
            const data =  await getApplications();

            setApplications(data);
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    };

    fectApplications();
  }, []);

  async function
  handleStatusUpdate(
    id,
    status
  ) {
    try {
      await updateApplicationStatus(
        id,
        status
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id
            ? {
                ...app,
                status,
              }
            : app
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  const filtered =
    useMemo(() => {
      return filterApplications(
        applications,
        search,
        activeTab
      );
    }, [
      applications,
      search,
      activeTab,
    ]);

  const stats =
    useMemo(() => {
      return getEnrollmentStats(
        applications
      );
    }, [applications]);

  return {
    applications,
    filtered,
    stats,
    loading,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    handleStatusUpdate,
  };
}