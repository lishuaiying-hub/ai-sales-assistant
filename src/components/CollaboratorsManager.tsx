import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// 人员类型定义
interface Person {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  permission: 'read' | 'edit' | 'admin';
}

// 角色选项
const ROLE_OPTIONS = ['销售代表', '技术顾问', '产品经理', '项目经理', '财务顾问', '其他'];

// 权限选项
const PERMISSION_OPTIONS = [
  { value: 'read', label: '只读' },
  { value: 'edit', label: '可编辑' },
  { value: 'admin', label: '管理员' }
];

// 模拟数据
const mockTeamMembers: Person[] = [
  {
    id: '1',
    name: '张明',
    role: '销售代表',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Sales%20manager%20avatar&sign=5dde9aff29c4d8d6fc41e02f0349acdf',
    email: 'zhangming@example.com',
    permission: 'admin'
  },
  {
    id: '2',
    name: '李华',
    role: '技术顾问',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Technical%20consultant%20avatar&sign=753b8b88d0e7b7b57a55ecee3465f3fd',
    email: 'lihua@example.com',
    permission: 'edit'
  },
  {
    id: '3',
    name: '王丽',
    role: '产品经理',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Product%20manager%20avatar&sign=6f156e34e6894615df7b53c44beba979',
    email: 'wangli@example.com',
    permission: 'read'
  }
];

interface CollaboratorsManagerProps {
  opportunityId: string;
  onCollaboratorsChange?: (collaborators: Person[]) => void;
}

const CollaboratorsManager: React.FC<CollaboratorsManagerProps> = ({ 
  opportunityId,
  onCollaboratorsChange
}) => {
  const [collaborators, setCollaborators] = useState<Person[]>(mockTeamMembers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: '',
    role: '',
    permission: 'read' as 'read' | 'edit' | 'admin'
  });
  
  // 权限颜色映射
  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'edit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'read':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // 权限名称映射
  const getPermissionName = (permission: string) => {
    switch (permission) {
      case 'admin':
        return '管理员';
      case 'edit':
        return '可编辑';
      case 'read':
        return '只读';
      default:
        return '未知';
    }
  };
  
  // 添加协作者
  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCollaborator.name || !newCollaborator.email || !newCollaborator.role) {
      toast.warning('请填写完整信息');
      return;
    }
    
    // 检查邮箱是否已存在
    if (collaborators.some(c => c.email === newCollaborator.email)) {
      toast.warning('该邮箱已添加');
      return;
    }
    
    const newPerson: Person = {
      id: Date.now().toString(),
      name: newCollaborator.name,
      role: newCollaborator.role,
      email: newCollaborator.email,
      permission: newCollaborator.permission,
      avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Business%20professional%20avatar&sign=c8b3c802e9bdf047140b4ccd1052b32f`
    };
    
    const updatedCollaborators = [...collaborators, newPerson];
    setCollaborators(updatedCollaborators);
    
    if (onCollaboratorsChange) {
      onCollaboratorsChange(updatedCollaborators);
    }
    
    // 重置表单
    setNewCollaborator({
      name: '',
      email: '',
      role: '',
      permission: 'read'
    });
    setShowAddForm(false);
    
    toast.success('协作者添加成功');
  };
  
  // 删除协作者
  const handleDeleteCollaborator = (id: string) => {
    // 不能删除管理员
    const person = collaborators.find(c => c.id === id);
    if (person && person.permission === 'admin' && collaborators.filter(c => c.permission === 'admin').length <= 1) {
      toast.warning('不能删除唯一的管理员');
      return;
    }
    
    const updatedCollaborators = collaborators.filter(c => c.id !== id);
    setCollaborators(updatedCollaborators);
    
    if (onCollaboratorsChange) {
      onCollaboratorsChange(updatedCollaborators);
    }
    
    toast.success('协作者已移除');
  };
  
  // 更新协作者权限
  const handleUpdatePermission = (id: string, permission: 'read' | 'edit' | 'admin') => {
    // 确保至少有一个管理员
    const currentPerson = collaborators.find(c => c.id === id);
    if (currentPerson && currentPerson.permission === 'admin' && permission !== 'admin' && collaborators.filter(c => c.permission === 'admin').length <= 1) {
      toast.warning('至少需要保留一个管理员');
      return;
    }
    
    const updatedCollaborators = collaborators.map(c => 
      c.id === id ? { ...c, permission } : c
    );
    
    setCollaborators(updatedCollaborators);
    
    if (onCollaboratorsChange) {
      onCollaboratorsChange(updatedCollaborators);
    }
    
    toast.success('权限已更新');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <i className="fa-solid fa-users text-blue-500 mr-2"></i>
          参与人员管理
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center space-x-2 transition-colors text-sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className="fa-solid fa-plus"></i>
          <span>添加人员</span>
        </motion.button>
      </div>
      
      {/* 添加人员表单 */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <form onSubmit={handleAddCollaborator} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={newCollaborator.name}
                    onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    placeholder="请输入邮箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    角色
                  </label>
                  <select
                    value={newCollaborator.role}
                    onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                  >
                    <option value="">请选择角色</option>
                    {ROLE_OPTIONS.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    权限
                  </label>
                  <select
                    value={newCollaborator.permission}
                    onChange={(e) => setNewCollaborator({...newCollaborator, permission: e.target.value as 'read' | 'edit' | 'admin'})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                  >
                    {PERMISSION_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  onClick={() => setShowAddForm(false)}
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  添加
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 协作者列表 */}
      <div className="space-y-3">
        {collaborators.map((collaborator) => (
          <motion.div
            key={collaborator.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-750"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={collaborator.avatar} 
                  alt={collaborator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{collaborator.name}</h4>
                  {collaborator.permission === 'admin' && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                      负责人
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{collaborator.role}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{collaborator.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <select
                  value={collaborator.permission}
                  onChange={(e) => handleUpdatePermission(collaborator.id, e.target.value as 'read' | 'edit' | 'admin')}
                  className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white text-sm"
                >
                  {PERMISSION_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:hidden">
                <span className={`px-2 py-1 text-xs rounded-full ${getPermissionColor(collaborator.permission)}`}>
                  {getPermissionName(collaborator.permission)}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors"
                onClick={() => handleDeleteCollaborator(collaborator.id)}
                disabled={collaborator.permission === 'admin' && collaborators.filter(c => c.permission === 'admin').length <= 1}
              >
                <i className="fa-solid fa-trash"></i>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 提示信息 */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p><i className="fa-solid fa-circle-info mr-1"></i> 管理员拥有最高权限，可以添加/删除成员和修改权限；可编辑权限可以修改商机信息；只读权限只能查看商机详情。</p>
      </div>
    </div>
  );
};

export default CollaboratorsManager;