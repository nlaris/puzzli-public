export const getTodaysDate = (): string => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let monthString = month >= 10 ? month.toString() : "0" + month;
  let dayString = day >= 10 ? day.toString() : "0" + day;
  return `${year}-${monthString}-${dayString}`;
};

export const getGameNumber = (): number => {
  const startDate: number = new Date("2024/05/27").setHours(0, 0, 0, 0).valueOf();
  const today: number = new Date().setHours(0, 0, 0, 0).valueOf();
  return Math.ceil((today - startDate) / 86400000) + 1;
};

export const formatTime = (elapsedTime: number): string => {
  let minutes: number = Math.floor(elapsedTime / (1000 * 60));
  let seconds: number = Math.floor(elapsedTime / 1000 % 60);

  let secondsString: string = String(seconds).padStart(2, "0");

  return `${minutes}:${secondsString}`;
};

export const getUserId = (getStoredUserId: () => string | undefined, setStoredUserId: (id: string) => void): string => {
  const storedUserId = getStoredUserId();
  if (storedUserId === undefined) {
    const userId = crypto.randomUUID();
    setStoredUserId(userId);
    return userId;
  }
  return storedUserId;
};

export const getSolutionsFontColor = (numSolutions: number): string => {
  if (numSolutions === 1) return 'red';
  if (numSolutions <= 3) return 'yellow';
  return 'green';
}
