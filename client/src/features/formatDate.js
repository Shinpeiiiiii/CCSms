export const formatDate = (date) => {
    if(!date) return "-";

    return new Date(date).toLocaleDateString("en-PH",{
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};