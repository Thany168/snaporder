const OwnerTable = () => {
    const [owners, setOwners] = useState([]);

    const fetchOwners = async () => {
        const res = await axios.get('/api/admin/owners');
        setOwners(res.data.data);
    };

    useEffect(() => { fetchOwners(); }, []);

    const handleToggleStatus = async (id, newStatus) => {
        try {
            await axios.patch(`/api/admin/owners/${id}/status`, { status: newStatus });
            alert(`Shop is now ${newStatus}`);
            fetchOwners(); // Refresh list
        } catch (err) {
            alert("Error updating status");
        }
    };

    return (
        <div className="overflow-x-auto p-6">
            <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                    <tr className="border-b bg-gray-50 text-left">
                        <th className="p-4">Shop Name</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {owners.map(owner => (
                        <tr key={owner.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{owner.shop_name}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    owner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {owner.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-4 flex space-x-2">
                                <button 
                                    onClick={() => handleToggleStatus(owner.id, owner.status === 'active' ? 'suspended' : 'active')}
                                    className="text-sm bg-gray-800 text-white px-3 py-1 rounded"
                                >
                                    {owner.status === 'active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button className="text-sm text-red-600 font-medium">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};