const EmptyState = ({ icon: Icon, heading, subtext }) => (
    <div className="p-12 text-center">
        {Icon && <Icon size={36} className="mx-auto mb-3 text-gray-300" />}
        <p className="text-sm text-gray-500">{heading}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
);

export default EmptyState;
