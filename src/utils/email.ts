/**
 * Send a team invitation email
 * @param email - The invitee's email address
 * @param name - The invitee's full name
 * @param role - The assigned role
 * @param permissions - List of granted permissions
 */
export async function sendTeamInvite(
  email: string,
  name: string,
  role: string,
  permissions: string[]
): Promise<void> {
  // In a real application, this would use an email service
  // For now, we'll simulate the email sending with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a secure invitation token (in a real app, this would be stored in the database)
  const inviteToken = Math.random().toString(36).substr(2, 24);
  const inviteUrl = `${window.location.origin}/register?token=${inviteToken}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;
  
  console.log(`
    To: ${email}
    Subject: You've Been Invited to Join the Team
    
    Dear ${name},
    
    You've been invited to join the team as a ${role.charAt(0).toUpperCase() + role.slice(1)}. 
    
    Your permissions will include:
    ${permissions.map(p => `- ${p}`).join('\n    ')}
    
    To complete your account setup and activate your access, please click the link below:
    ${inviteUrl}
    
    This invitation link will expire in 7 days. If you don't complete the registration process,
    your account will remain in a pending state.
    
    Best regards,
    The Team
  `);
}

/**
 * Send a suspension notification email to a user
 * @param email - The user's email address
 * @param reason - The reason for suspension
 */
export async function sendSuspensionEmail(email: string, reason: string): Promise<void> {
  // In a real application, this would use an email service
  // For now, we'll simulate the email sending with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`
    To: ${email}
    Subject: Your ProPhone Account Has Been Suspended
    
    Dear User,
    
    Your ProPhone account has been suspended for the following reason:
    ${reason}
    
    If you believe this is a mistake or would like to appeal this decision,
    please contact our support team at support@prophone.io.
    
    Best regards,
    The ProPhone Team
  `);
}

/**
 * Send a reactivation notification email to a user
 * @param email - The user's email address
 */
export async function sendReactivationEmail(email: string): Promise<void> {
  // In a real application, this would use an email service
  // For now, we'll simulate the email sending with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`
    To: ${email}
    Subject: Your ProPhone Account Has Been Reactivated
    
    Dear User,
    
    Great news! Your ProPhone account has been reactivated. You now have full access to all platform features.
    
    You can log in to your account at any time using your existing credentials.
    
    If you have any questions or need assistance, please don't hesitate to contact our support team at support@prophone.io.
    
    Best regards,
    The ProPhone Team
  `);
}

/**
 * Send a ban notification email to a user
 * @param email - The user's email address
 * @param reason - The reason for the ban
 */
export async function sendBanEmail(email: string, reason: string): Promise<void> {
  // In a real application, this would use an email service
  // For now, we'll simulate the email sending with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`
    To: ${email}
    Subject: Your ProPhone Account Has Been Permanently Banned
    
    Dear User,
    
    Your ProPhone account has been permanently banned for the following reason:
    ${reason}
    
    As a result of this ban:
    - Your account has been permanently deleted
    - You will not be able to create new accounts using this email address
    - All associated data has been removed from our platform
    
    This decision is final and cannot be appealed.
    
    Best regards,
    The ProPhone Team
  `);
}

/**
 * Send an unban notification email to a user
 * @param email - The user's email address
 */
export async function sendUnbanEmail(email: string): Promise<void> {
  // In a real application, this would use an email service
  // For now, we'll simulate the email sending with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`
    To: ${email}
    Subject: Your ProPhone Account Ban Has Been Lifted
    
    Dear User,
    
    We are writing to inform you that your email address has been removed from our platform's ban list.
    
    You may now create a new account on ProPhone if you wish to use our services again.
    
    Please note that all platform rules and terms of service still apply to any new accounts.
    
    Best regards,
    The ProPhone Team
  `);
}