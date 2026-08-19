import { ConfirmModal } from "@/components/modal";

<ConfirmModal
    open={openPublish}
    title="Publish Curriculum"
    description="Publishing will lock this curriculum for editing."

    confirmLabel="Publish"

    onConfirm={confirmPublish}

    onClose={() => setOpenPublish(false)}
/>