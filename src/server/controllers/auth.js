try {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
 
  // Special case for owner login
  if (email === 'dallas@prophone.io' && password === 'owner') {
    const ownerData = {
      id: '0',
      name: 'Dallas Reynolds',
      email: 'dallas@prophone.io',
      role: 'owner',
      showAds: false,
      avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png'
    };
    return res.json({ ownerData });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if user is suspended or banned
  if (user.status === 'suspended' || user.status === 'banned') {
    return res.status(403).json({ error: 'Account is suspended or banned' });
  }

  // For sub_users, verify parent user
  if (user.role === 'sub_user' && user.parentUser) {
    const parentUser = await User.findById(user.parentUser);
    if (!parentUser || parentUser.status !== 'active') {
      return res.status(403).json({ error: 'Parent account is inactive' });
    }
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set showAds based on role
  user.showAds = !(user.role === 'owner' || user.role === 'super_admin' || user.adFreeSubscription?.active);
  await user.save();

  // Ensure we're sending a valid JSON response
  const response = {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      showAds: user.showAds,
      avatar: user.avatar
    },
    token
  };

  res.json(response);
} catch (error) {
  console.error('Login error:', error);
  res.status(500).json({ error: 'Internal server error' });
}