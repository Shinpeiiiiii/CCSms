import { useState } from "react";
import Modal from "../../../../../components/modal/Modal";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/buttons";

const ImportCurriculumModal = ({ isOpen, onClose, onSubmit, loading }) => {
    const [json, setJson] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const payload = JSON.parse(json);
            await onSubmit(payload);
        } catch (err) {
            setError("Invalid JSON. Please check your input.");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setJson(event.target.result);
            setError("");
        };
        reader.readAsText(file);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Import Curriculum"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 text-sm font-medium cursor-pointer transition-all hover:bg-zinc-100"
                    >
                        Cancel
                    </button>
                    <PrimaryButton type="submit" form="import-form" disabled={!json.trim()}>
                        Import
                    </PrimaryButton>
                </>
            }
        >
            <form id="import-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Upload JSON File</label>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="mt-1 block w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Or paste JSON</label>
                    <textarea
                        value={json}
                        onChange={(e) => {
                            setJson(e.target.value);
                            setError("");
                        }}
                        rows={12}
                        placeholder='{"curriculumCode": "BSIT-2024", "subjects": [...]}'
                        className="font-mono text-xs w-full rounded-lg border border-zinc-200 bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                <p className="text-xs text-zinc-500">
                    Import will create a new Draft curriculum. Existing curriculum codes will be rejected.
                </p>
            </form>
        </Modal>
    );
};

export default ImportCurriculumModal;
