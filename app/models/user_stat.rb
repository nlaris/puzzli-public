class UserStat < ApplicationRecord
  validates :streak, numericality: {greater_than_or_equal_to: 0}
end
