const User = require("../models/User");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSubUserSubscription = async (req, res) => {
  try {
    const { parentUserId, subUserId } = req.body;
    const parentUser = await User.findById(parentUserId);
    const subUser = await User.findById(subUserId);

    if (!parentUser || !subUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe subscription for sub-user
    const subscription = await stripe.subscriptions.create({
      customer: parentUser.stripeCustomerId,
      items: [{ price: process.env.SUB_USER_PRICE_ID }], // $5/month price
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Add sub-user subscription to parent user
    parentUser.subUserSubscriptions.push({
      subUserId: subUser._id,
      active: true,
      startDate: new Date(),
      nextBillingDate: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionId: subscription.id
    });

    await parentUser.save();

    // Set showAds to true for new sub-user
    subUser.showAds = true;
    await subUser.save();

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Sub-user subscription error:', error);
    res.status(500).json({ error: 'Failed to create sub-user subscription' });
  }
};

exports.cancelSubUserSubscription = async (req, res) => {
  try {
    const { parentUserId, subUserId } = req.body;
    const parentUser = await User.findById(parentUserId);

    if (!parentUser) {
      return res.status(404).json({ error: 'Parent user not found' });
    }

    const subUserSub = parentUser.subUserSubscriptions.find(
      sub => sub.subUserId.toString() === subUserId
    );

    if (!subUserSub) {
      return res.status(404).json({ error: 'Sub-user subscription not found' });
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.del(subUserSub.stripeSubscriptionId);

    // Remove sub-user subscription
    parentUser.subUserSubscriptions = parentUser.subUserSubscriptions.filter(
      sub => sub.subUserId.toString() !== subUserId
    );

    await parentUser.save();

    // Delete or deactivate sub-user account
    await User.findByIdAndUpdate(subUserId, { status: 'inactive' });

    res.json({ message: 'Sub-user subscription cancelled successfully' });
  } catch (error) {
    console.error('Sub-user subscription cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel sub-user subscription' });
  }
};
exports.createAdFreeSubscription = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: process.env.AD_FREE_PRICE_ID }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user with subscription info
    user.adFreeSubscription = {
      active: true,
      startDate: new Date(),
      nextBillingDate: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionId: subscription.id
    };
    user.showAds = false;
    await user.save();

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

exports.cancelAdFreeSubscription = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.adFreeSubscription?.stripeSubscriptionId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.del(user.adFreeSubscription.stripeSubscriptionId);

    // Update user
    user.adFreeSubscription = undefined;
    user.showAds = true;
    await user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};