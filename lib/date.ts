export const getCurrentDate = (date?: string): string => {
    const now = date ? new Date(date) : new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`
}


const calculateDaysDifference = (date1: string, date2: string) => {
    const date1Obj = new Date(date1);
    const date2Obj = new Date(date2);
    
    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(date2Obj.getTime() - date1Obj.getTime());

    // Convert milliseconds to days (1 day = 1000 * 60 * 60 * 24 milliseconds)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return Math.ceil(diffInDays);
};