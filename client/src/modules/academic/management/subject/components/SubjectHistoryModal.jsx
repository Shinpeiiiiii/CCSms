import Modal from "../../../../../components/modal/Modal";

import useSubjectHistory from "../hooks/useSubjectHistory";
import DataTable from "../../../../../components/table/DataTable";
import SubjectHistoryColumns from "./SubjectHistoryColumn";
import { useState } from "react";
import SubjectVersionDetailsModal from "./SubjectVersionDetailModal";

const SubjectHistoryModal = ({
    isOpen,
    onClose,
    subject,
    onCreateVersion
}) => {

    const {
        history,
        loading,
    } = useSubjectHistory(subject?._id, isOpen);
    
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(null);

    const handleView = (item) => {

        setSelectedVersion(item);
        setIsDetailsOpen(true);

    };
    const columns = SubjectHistoryColumns({
        onView: handleView,
    });
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Subject Version History"
                size="lg">
                {
                    loading ? (
                        <p>Loading history...</p>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={history}
                            loading={loading}
                            emptyMessage="No subject versions found."
                        />
                    )
                }
            </Modal>
             <SubjectVersionDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                subject={selectedVersion}
                onCreateVersion={onCreateVersion}
            />
        </>
    );

};

export default SubjectHistoryModal;