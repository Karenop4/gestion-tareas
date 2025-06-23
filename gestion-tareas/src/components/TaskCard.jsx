const TaskCard = ({ title, description, dueDate }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-xl">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm text-gray-400 mt-2">Entrega: {dueDate}</p>
    </div>
  );
};

export default TaskCard;
