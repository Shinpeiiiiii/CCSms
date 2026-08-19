import { useState } from "react";
import { Modal } from "@/components/modal";
import { DataTable } from "@/components/table";

import useCurriculumHistory from "../hooks/useCurriculumHistory";
import CurriculumHistoryColumns from "./CurriculumHistoryColumn";
import CurriculumVersionDetailsModal from "./CurriculumVersionDetailsModal"

const CurriculumHistoryModal = ({
    isOpen,
    onClose,
    curriculum,
    onCreateVersion,
}) => {

    const{
        history,
        loading,

    } = useCurriculumHistory(curriculum?._id, isOpen);


    const [selectedVersion, setSelectedVersion] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(null);

    const handleView = (item) => {
        setSelectedVersion(item);
        setIsDetailsOpen(true);
    };

    const columns = CurriculumHistoryColumns({
        onView: handleView,
    });

    return(
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Curriculum Version History"
                size="lg">
                {
                    loading ? (
                        <p>Loading History...</p>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={history}
                            loading={loading}
                            emptyMessage="No curriculum versions found."
                        />
                    )
                }
            </Modal>
            <CurriculumVersionDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                curriculum={selectedVersion}
                onCreateVersion={onCreateVersion}
            />
        </>
    )
}

export default CurriculumHistoryModal;