import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCurriculum, publishCurriculum as publishCurriculumService,
     archiveCurriculum as archiveCurriculumService} from "../services/curriculum.services";

const useCurriculum = () => {

    const [curriculum, setCurriculum] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadCurriculums = async () => {

        try {

            const data = await getCurriculum();

            setCurriculum(data);

        }

        catch (error) {

            console.error(
                "Failed to load curriculums:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };

    const publishCurriculum = async(id) => {
        try{
            await publishCurriculumService(id);
            toast.success("Curriculum published successfully.");
            loadCurriculums();
        }catch(error){
            toast.error(error.response?.data?.message || "Failed to publish curriculum")
        }
    }
    const archiveCurriculum = async(id) => {
        try{
            await archiveCurriculumService(id);
            toast.success("Archive curriculum successfully.");
            loadCurriculums();
        }catch(error){
            toast.error(error.response?.data?.message || "Failed to archive.")
        }
    }

    useEffect(() => {

        loadCurriculums();

    }, []);

    return {

        curriculum,

        loading,

        refreshCurriculums: loadCurriculums,
        publishCurriculum: async (id) => {
            await publishCurriculumService(id);
            await loadCurriculums();
        },
        archiveCurriculum: async (id) => {
            await archiveCurriculumService(id);
            await loadCurriculums();
        },

    };

};

export default useCurriculum;