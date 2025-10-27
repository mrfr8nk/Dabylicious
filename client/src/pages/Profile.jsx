import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Users, ChefHat, Heart, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import RecipeCard from '../components/RecipeCard';
import api from '../utils/api';

function Profile({ currentUser }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/user/profile/${userId}`);
      setUser(response.data.user);
      
      if (currentUser && response.data.user.followers) {
        setIsFollowing(response.data.user.followers.some(
          id => id.toString() === currentUser.id.toString()
        ));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await api.post(`/user/follow/${userId}`);
      setIsFollowing(response.data.following);
      loadProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8">
          <p className="text-white text-lg">User not found</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id.toString() === userId;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-4 border-white/30 flex items-center justify-center">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-white">{user.name[0].toUpperCase()}</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
              {user.bio && <p className="text-white/80 mb-4">{user.bio}</p>}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.createdRecipes?.length || 0}</div>
                  <div className="text-white/70 text-sm">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.followers?.length || 0}</div>
                  <div className="text-white/70 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.following?.length || 0}</div>
                  <div className="text-white/70 text-sm">Following</div>
                </div>
              </div>

              {!isOwnProfile && currentUser && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-lg border transition-all duration-200 ${
                    isFollowing
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="flex gap-3 mb-6 overflow-x-auto">
          <TabButton
            icon={ChefHat}
            label="Created Recipes"
            active={activeTab === 'recipes'}
            onClick={() => setActiveTab('recipes')}
          />
          {isOwnProfile && (
            <>
              <TabButton
                icon={Heart}
                label="Favorites"
                active={activeTab === 'favorites'}
                onClick={() => setActiveTab('favorites')}
              />
              <TabButton
                icon={BookOpen}
                label="Cooking Journal"
                active={activeTab === 'journal'}
                onClick={() => setActiveTab('journal')}
              />
            </>
          )}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'recipes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.createdRecipes && user.createdRecipes.length > 0 ? (
                user.createdRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12">
                    <ChefHat className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70">No recipes created yet</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && isOwnProfile && <FavoritesTab />}
          {activeTab === 'journal' && isOwnProfile && <JournalTab />}
        </motion.div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-lg border transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-white/40 text-white'
          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );
}

function FavoritesTab() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await api.get('/user/favorites');
      setFavorites(response.data.recipes);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.length > 0 ? (
        favorites.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)
      ) : (
        <div className="col-span-full text-center py-20">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12">
            <Heart className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">No favorite recipes yet</p>
          </div>
        </div>
      )}
    </div>
  );
}

function JournalTab() {
  const [journal, setJournal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = async () => {
    try {
      const response = await api.get('/user/cooking-journal');
      setJournal(response.data.journal);
    } catch (error) {
      console.error('Error loading journal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {journal.length > 0 ? (
        journal.map((entry, index) => (
          <div
            key={index}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
          >
            <Link
              to={`/recipe/${entry.recipeId}`}
              className="text-xl font-bold text-white hover:text-purple-300 transition-colors mb-2 block"
            >
              {entry.recipe?.title}
            </Link>
            <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
              <span>{[...Array(5)].map((_, i) => (
                <span key={i} className={i < entry.rating ? 'text-yellow-400' : 'text-white/30'}>⭐</span>
              ))}</span>
              <span>{new Date(entry.cookedAt).toLocaleDateString()}</span>
            </div>
            {entry.notes && <p className="text-white/80">{entry.notes}</p>}
          </div>
        ))
      ) : (
        <div className="text-center py-20">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12">
            <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">No cooking journal entries yet</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
