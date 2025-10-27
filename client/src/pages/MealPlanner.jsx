import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, X, CalendarDays, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

function MealPlanner({ user }) {
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadMealPlans();
  }, [user]);

  const loadMealPlans = async () => {
    try {
      const response = await api.get('/meal-plans');
      setMealPlans(response.data.mealPlans);
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/meal-plans', newPlan);
      if (response.data.success) {
        setMealPlans([response.data.mealPlan, ...mealPlans]);
        setShowCreateForm(false);
        setNewPlan({ name: '', startDate: '', endDate: '' });
      }
    } catch (error) {
      console.error('Error creating meal plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading meal plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-lg bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-white/30 mb-6">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Meal Planner</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Plan your meals and generate grocery lists
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-4 rounded-xl backdrop-blur-lg bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-white/30 text-white hover:from-green-500/40 hover:to-emerald-500/40 transition-all duration-200 font-semibold shadow-lg"
          >
            {showCreateForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{showCreateForm ? 'Cancel' : 'Create New Meal Plan'}</span>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Meal Plan</h2>
              <form onSubmit={handleCreatePlan} className="space-y-5">
                <div>
                  <label className="block text-white/80 mb-2 font-medium">Plan Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Week of Jan 1-7"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Start Date</label>
                    <input
                      type="date"
                      value={newPlan.startDate}
                      onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
                      required
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">End Date</label>
                    <input
                      type="date"
                      value={newPlan.endDate}
                      onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
                      required
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-6 py-4 rounded-xl backdrop-blur-lg bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-white/30 text-white hover:from-green-500/40 hover:to-emerald-500/40 transition-all duration-200 font-semibold shadow-lg"
                >
                  Create Meal Plan
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.length > 0 ? (
            mealPlans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MealPlanCard plan={plan} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12">
                <CalendarDays className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70 text-lg">
                  No meal plans yet. Create your first meal plan to get started!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MealPlanCard({ plan }) {
  const startDate = new Date(plan.startDate).toLocaleDateString();
  const endDate = new Date(plan.endDate).toLocaleDateString();

  return (
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-white/70 text-sm flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {startDate} - {endDate}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg backdrop-blur-md bg-white/5">
          <div className="text-2xl font-bold text-white">{plan.meals?.length || 0}</div>
          <div className="text-white/70 text-sm">Meals Planned</div>
        </div>
        <div className="text-center p-3 rounded-lg backdrop-blur-md bg-white/5">
          <div className="text-2xl font-bold text-white">{plan.groceryList?.length || 0}</div>
          <div className="text-white/70 text-sm">Grocery Items</div>
        </div>
      </div>

      <div className="space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        >
          View Details
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-white/20 text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>View Grocery List</span>
        </motion.button>
      </div>
    </div>
  );
}

export default MealPlanner;
