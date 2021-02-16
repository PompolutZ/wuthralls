export const sortByIdAsc = ({ id: prevId }, { id: nextId }) => {
    return prevId.localeCompare(nextId);
};
