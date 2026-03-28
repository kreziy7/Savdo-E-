const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updateProfile = async (userId, updateData) => {
  const allowed = ['name', 'phone', 'avatar'];
  const filteredData = Object.keys(updateData)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {});

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
  return { message: 'Password changed successfully' };
};

const addAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (addressData.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(addressData);
  await user.save();
  return user.addresses;
};

const updateAddress = async (userId, addressId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const address = user.addresses.id(addressId);
  if (!address) throw new ApiError(404, 'Address not found');

  if (addressData.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, addressData);
  await user.save();
  return user.addresses;
};

const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const address = user.addresses.id(addressId);
  if (!address) throw new ApiError(404, 'Address not found');

  address.deleteOne();
  await user.save();
  return user.addresses;
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
};
