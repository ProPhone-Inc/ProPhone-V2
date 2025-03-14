/**
 * Check if a user should be marked as inactive based on their last login date
 * @param lastLogin - The user's last login date
 * @returns boolean - True if the user should be marked as inactive
 */
export function isUserInactive(lastLogin: string): boolean {
  // If user has never logged in or has 'Never' as last login, they are inactive
  if (!lastLogin || lastLogin === 'Never') return true;
  
  // Handle ISO string or localized date string
  const date = lastLogin.includes('T') 
    ? new Date(lastLogin)
    : new Date(lastLogin.split(',')[0]); // Handle "MM/DD/YYYY, HH:MM:SS" format
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return date < thirtyDaysAgo;
}