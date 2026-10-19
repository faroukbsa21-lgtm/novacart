import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Shield,
  UserCheck,
  Tag,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDZD } from '../utils/formatters';

export default function AdminModal({ isOpen, onClose, onProductUpdated }) {
  const { user: currentAdmin } = useAuth();
  const { language, t, isRTL } = useLanguage();
  const [tab, setTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'customers'
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    total_users: 0
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // New Product Modal state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('11111111-1111-1111-1111-111111111111');
  const [newPrice, setNewPrice] = useState('');
  const [newComparePrice, setNewComparePrice] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newStock, setNewStock] = useState('25');
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editComparePrice, setEditComparePrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);

  const showNotification = (msg, type = 'success') => {
    setFeedbackMessage({ text: msg, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Realtime Data Fetcher
  const fetchAllAdminData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [statsData, prodData, ordersData, usersData] = await Promise.allSettled([
        api.getAdminStats(),
        api.getProducts({ limit: 100 }),
        api.getAdminOrders(),
        api.getAdminUsers()
      ]);

      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(statsData.value?.stats || statsData.value);
      }
      if (prodData.status === 'fulfilled' && prodData.value) {
        setProducts(prodData.value?.items || prodData.value?.data || []);
      }
      if (ordersData.status === 'fulfilled' && ordersData.value) {
        const orderList = Array.isArray(ordersData.value) ? ordersData.value : (ordersData.value?.data || []);
        setOrders(orderList);
      }
      if (usersData.status === 'fulfilled' && usersData.value) {
        const uList = Array.isArray(usersData.value) ? usersData.value : (usersData.value?.data || []);
        setUsersList(uList);
      }
    } catch (err) {
      console.error('Failed to sync admin data', err);
    } finally {
      if (!isSilent) setRefreshing(false);
    }
  }, []);

  // Initial load and periodic Real-Time sync
  useEffect(() => {
    if (!isOpen) return;
    fetchAllAdminData();

    // Auto realtime refresh interval (every 12 seconds)
    const interval = setInterval(() => {
      fetchAllAdminData(true);
    }, 12000);

    return () => clearInterval(interval);
  }, [isOpen, fetchAllAdminData]);

  if (!isOpen) return null;

  // --- ORDER STATUS REALTIME UPDATE ---
  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic realtime update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showNotification(`Commande mise à jour: ${newStatus}`);
      fetchAllAdminData(true);
    } catch (e) {
      showNotification('Échec de mise à jour du statut', 'error');
      fetchAllAdminData(true);
    }
  };

  // --- PRODUCT MANAGEMENT ---
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setEditTitle(p.title || '');
    setEditCategory(p.category_id || p.category?.id || '11111111-1111-1111-1111-111111111111');
    setEditPrice(p.price !== undefined ? String(p.price) : '');
    setEditComparePrice(p.compare_at_price ? String(p.compare_at_price) : '');
    setEditStock(p.stock_quantity !== undefined ? String(p.stock_quantity) : '0');
    setEditDesc(p.description || '');
    const imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);
    setEditImageUrl(imgs[0] || '');
    setEditIsFeatured(!!p.is_featured);
  };

  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const payload = {
      title: editTitle.trim(),
      category_id: editCategory,
      price: parseFloat(editPrice) || 0,
      compare_at_price: editComparePrice ? parseFloat(editComparePrice) : null,
      stock_quantity: parseInt(editStock, 10) || 0,
      description: editDesc.trim(),
      images: [editImageUrl.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      is_featured: editIsFeatured
    };

    const targetId = editingProduct.id;
    // Optimistic realtime update in local state
    setProducts(prev => prev.map(p => p.id === targetId ? { ...p, ...payload } : p));
    setEditingProduct(null);

    try {
      await api.updateProduct(targetId, payload);
      showNotification(`Produit "${payload.title}" mis à jour avec succès !`);
      if (onProductUpdated) onProductUpdated();
      fetchAllAdminData(true);
    } catch (err) {
      showNotification(err.message || 'Erreur lors de la mise à jour du produit', 'error');
      fetchAllAdminData(true);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const productPayload = {
      category_id: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim(),
      price: parseFloat(newPrice) || 0,
      compare_at_price: newComparePrice ? parseFloat(newComparePrice) : null,
      sku: newSku.trim() || 'SKU-' + Math.floor(Math.random() * 9000 + 1000),
      stock_quantity: parseInt(newStock, 10) || 10,
      images: [newImageUrl.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      is_featured: isFeatured,
      is_active: true
    };

    setShowAddProduct(false);

    try {
      const res = await api.createProduct(productPayload);
      const createdItem = res?.data || res?.product || productPayload;
      setProducts(prev => [createdItem, ...prev.filter(p => p.id !== createdItem.id)]);
      showNotification(`Produit "${productPayload.title}" ajouté avec succès !`);
      
      // Reset form
      setNewTitle('');
      setNewPrice('');
      setNewComparePrice('');
      setNewSku('');
      setNewDesc('');
      setNewImageUrl('');
      setIsFeatured(false);

      if (onProductUpdated) onProductUpdated();
      fetchAllAdminData(true);
    } catch (e) {
      showNotification(e.message || 'Erreur lors de la création du produit', 'error');
      fetchAllAdminData(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit du catalogue ?')) return;

    // Optimistic update
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await api.deleteProduct(id);
      showNotification('Produit supprimé avec succès');
      if (onProductUpdated) onProductUpdated();
      fetchAllAdminData(true);
    } catch (e) {
      showNotification('Échec de suppression du produit', 'error');
      fetchAllAdminData(true);
    }
  };

  // --- USER & ROLE MANAGEMENT ---
  const handleUserRoleChange = async (targetUser, newRole) => {
    if (targetUser.id === currentAdmin?.id && newRole !== 'admin') {
      alert("Action refusée : Vous ne pouvez pas rétrograder votre propre compte administrateur.");
      return;
    }

    // Optimistic UI update
    setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole === 'mod' ? 'moderator' : newRole } : u));

    try {
      await api.updateUserRole(targetUser.id, newRole);
      showNotification(`Rôle de ${targetUser.full_name || targetUser.email} mis à jour : ${newRole}`);
      fetchAllAdminData(true);
    } catch (err) {
      showNotification(err.message || 'Échec de modification du rôle', 'error');
      fetchAllAdminData(true);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentAdmin?.id) {
      alert("Action refusée : Vous ne pouvez pas supprimer votre propre compte administrateur.");
      return;
    }

    if (!window.confirm(`Supprimer définitivement l'utilisateur ${targetUser.full_name || targetUser.email} ?`)) {
      return;
    }

    // Optimistic UI update
    setUsersList(prev => prev.filter(u => u.id !== targetUser.id));

    try {
      await api.deleteUser(targetUser.id);
      showNotification(`Utilisateur supprimé avec succès`);
      fetchAllAdminData(true);
    } catch (err) {
      showNotification(err.message || "Erreur lors de la suppression de l'utilisateur", 'error');
      fetchAllAdminData(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-4 sm:p-7 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Panneau d'Administration</h2>
                <span className="text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  Temps Réel
                </span>
              </div>
              <p className="text-xs text-slate-400">Gestion du catalogue, commandes clients et rôles utilisateurs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAllAdminData(false)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Synchroniser avec Supabase en temps réel"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin text-purple-400' : ''} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            feedbackMessage.type === 'error' 
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' 
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
          }`}>
            {feedbackMessage.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1.5 sm:gap-2 border-b border-slate-800 pb-3 mb-6 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              tab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <TrendingUp size={14} />
            <span>Vue Générale</span>
          </button>
          <button
            onClick={() => setTab('products')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              tab === 'products' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Package size={14} />
            <span>Produits ({products.length})</span>
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              tab === 'orders' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Commandes ({orders.length})</span>
          </button>
          <button
            onClick={() => setTab('customers')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              tab === 'customers' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Users size={14} />
            <span>Clients &amp; Rôles ({usersList.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ============================================================== */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>{t('admin_stat_revenue')}</span>
                  <DollarSign size={16} className="text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{formatDZD(Number(stats.total_revenue || 0), language)}</div>
                <span className="text-[10px] text-emerald-400 font-medium">DZD</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Commandes</span>
                  <ShoppingBag size={16} className="text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.total_orders || orders.length}</div>
                <span className="text-[10px] text-cyan-400 font-medium">Suivi en direct</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Articles au Catalogue</span>
                  <Package size={16} className="text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{products.length}</div>
                <span className="text-[10px] text-purple-400 font-medium">Stock synchronisé</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Comptes Enregistrés</span>
                  <Users size={16} className="text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{usersList.length || stats.total_users || 0}</div>
                <span className="text-[10px] text-amber-400 font-medium">Clients &amp; Modérateurs</span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Actions Rapides</h4>
                <p className="text-xs text-slate-400">Ajoutez des produits, ajustez les prix ou gérez les autorisations d'accès.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setTab('products'); setShowAddProduct(true); }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus size={14} />
                  <span>Nouveau Produit</span>
                </button>
                <button
                  onClick={() => setTab('customers')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Users size={14} />
                  <span>Gérer les Rôles</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRODUCTS (CREATE & EDIT & DELETE) */}
        {/* ============================================================== */}
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Modifiez les prix, stocks et descriptions en direct</span>
              {!showAddProduct && !editingProduct && (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Plus size={14} />
                  <span>Ajouter un Produit</span>
                </button>
              )}
            </div>

            {/* Form: ADD PRODUCT */}
            {showAddProduct && (
              <div className="p-5 rounded-2xl bg-slate-800/90 border border-purple-500/40 mb-4 animate-fade-in shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-1.5">
                    <Plus size={16} />
                    <span>Créer un Nouveau Produit</span>
                  </h4>
                  <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Titre du Produit *</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ex: Montre Chrono Titane"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Catégorie</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="11111111-1111-1111-1111-111111111111">{t('cat_electronics')}</option>
                        <option value="22222222-2222-2222-2222-222222222222">{t('cat_fashion')}</option>
                        <option value="33333333-3333-3333-3333-333333333333">{t('cat_home_living')}</option>
                        <option value="44444444-4444-4444-4444-444444444444">{t('cat_accessories')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">{t('admin_prod_price')} *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="Ex: 19500"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">{t('admin_prod_price')} (Promo)</label>
                      <input
                        type="number"
                        step="1"
                        value={newComparePrice}
                        onChange={(e) => setNewComparePrice(e.target.value)}
                        placeholder="Ex: 23500"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Quantité en Stock</label>
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">URL de l'Image</label>
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Détails du produit, caractéristiques et finitions..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded border-slate-700 text-purple-600 focus:ring-purple-400"
                      />
                      <span>Mettre en avant sur la page d'accueil</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Form: EDIT PRODUCT */}
            {editingProduct && (
              <div className="p-5 rounded-2xl bg-slate-800/90 border border-cyan-500/40 mb-4 animate-fade-in shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <Edit2 size={16} />
                    <span>Modifier le Produit : {editingProduct.title}</span>
                  </h4>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSaveProductEdit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Titre du Produit *</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Catégorie</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="11111111-1111-1111-1111-111111111111">{t('cat_electronics')}</option>
                        <option value="22222222-2222-2222-2222-222222222222">{t('cat_fashion')}</option>
                        <option value="33333333-3333-3333-3333-333333333333">{t('cat_home_living')}</option>
                        <option value="44444444-4444-4444-4444-444444444444">{t('cat_accessories')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">{t('admin_prod_price')} *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">{t('admin_prod_price')} (Promo)</label>
                      <input
                        type="number"
                        step="1"
                        value={editComparePrice}
                        onChange={(e) => setEditComparePrice(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Stock Disponible</label>
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">URL de l'Image</label>
                      <input
                        type="url"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editIsFeatured}
                        onChange={(e) => setEditIsFeatured(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-400"
                      />
                      <span>Produit Vedette (Featured)</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
                      >
                        Appliquer les Modifications
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Produit</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white max-w-[240px]">
                        <div className="truncate font-bold">{p.title}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{p.description}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{p.sku}</td>
                      <td className="p-3 font-bold text-white">
                        <div>{formatDZD(p.price, language)}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          p.stock_quantity > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {p.stock_quantity} en stock
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                          title="Modifier le produit et le prix"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Supprimer ce produit"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ORDERS */}
        {/* ============================================================== */}
        {tab === 'orders' && (
          <div className="space-y-4">
            <span className="text-xs text-slate-400">Gestion en direct de l'état des commandes et de la livraison</span>

            {orders.length === 0 ? (
              <div className="py-12 text-center border border-slate-800 rounded-2xl bg-slate-800/20">
                <ShoppingBag size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-white">Aucune commande client passée pour le moment</p>
                <p className="text-xs text-slate-400 mt-1">Dès qu'un client passe commande, elle s'affiche ici en direct.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">N° Commande</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Wilaya &amp; Livraison</th>
                      <th className="p-3">Montant</th>
                      <th className="p-3">Paiement</th>
                      <th className="p-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-bold text-purple-300">{o.order_number}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{o.customer_name}</div>
                          <div className="text-[10px] text-slate-500">{o.customer_email}</div>
                          {o.customer_phone && <div className="text-[10px] text-slate-400 font-mono">{o.customer_phone}</div>}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">
                            {o.shipping_address?.wilaya_name 
                              ? `${o.shipping_address.wilaya_code ? `[${o.shipping_address.wilaya_code}] ` : ''}${o.shipping_address.wilaya_name}` 
                              : (o.shipping_address?.city || 'Algérie')}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-medium">
                            {o.shipping_address?.delivery_type === 'desk' ? '🏢 Bureau (Stop Desk)' : '🏠 À Domicile'}
                            {o.shipping_address?.city ? ` (${o.shipping_address.city})` : ''}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white">{formatDZD(o.total_amount, language)}</div>
                        </td>
                        <td className="p-3 uppercase text-[10px] text-slate-400">{o.payment_method}</td>
                        <td className="p-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                          >
                            <option value="pending">en attente (pending)</option>
                            <option value="processing">en préparation (processing)</option>
                            <option value="shipped">expédié (shipped)</option>
                            <option value="delivered">livré (delivered)</option>
                            <option value="cancelled">annulé (cancelled)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CUSTOMERS & ROLE MANAGEMENT */}
        {/* ============================================================== */}
        {tab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Gestion des comptes clients, modérateurs et administrateurs</span>
              <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                {usersList.length} Utilisateurs
              </span>
            </div>

            {usersList.length === 0 ? (
              <div className="py-12 text-center border border-slate-800 rounded-2xl bg-slate-800/20">
                <Users size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-white">Aucun profil utilisateur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Utilisateur</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Date d'inscription</th>
                      <th className="p-3">Rôle Actuel</th>
                      <th className="p-3">Modifier Rôle</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {usersList.map((u) => {
                      const isSelf = u.id === currentAdmin?.id;
                      const roleNormalized = u.role === 'moderator' ? 'mod' : (u.role || 'customer');

                      return (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                u.role === 'admin' 
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                  : u.role === 'moderator' || u.role === 'mod'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <span className="font-semibold text-white block">
                                  {u.full_name || 'Sans Nom'}
                                </span>
                                {isSelf && (
                                  <span className="text-[10px] text-purple-400 font-bold block">(Votre compte)</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-slate-400">{u.email}</td>
                          <td className="p-3 text-slate-400">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : u.role === 'moderator' || u.role === 'mod'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {u.role === 'moderator' ? 'MODÉRATEUR' : u.role || 'CLIENT'}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={roleNormalized}
                              disabled={isSelf}
                              onChange={(e) => handleUserRoleChange(u, e.target.value)}
                              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-400 cursor-pointer disabled:opacity-50"
                            >
                              <option value="customer">Client (Customer)</option>
                              <option value="mod">Modérateur (Mod)</option>
                              <option value="admin">Administrateur (Admin)</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={isSelf}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-30 disabled:hover:text-slate-400"
                              title={isSelf ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer cet utilisateur"}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
