class CreateUserStats < ActiveRecord::Migration[7.1]
  def change
    create_table :user_stats do |t|
      t.string :user_id, index: {unique: true}
      t.string :last_completed_date
      t.integer :streak
    end
  end
end
