import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUserCheck, FaUserTimes, FaUsers, FaUserTag, FaShieldAlt, FaLink, FaMagic } from 'react-icons/fa';
import MainContent from '../../components/layout/MainContent';
import api from '../../services/api';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [positionRoles, setPositionRoles] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editingRole, setEditingRole] = useState(null);
    const [editingPermission, setEditingPermission] = useState(null);
    const [formData, setFormData] = useState({
        // User form
        mavc: '',
        ten_dang_nhap: '',
        email: '',
        ho_ten: '',
        chuc_vu: '',
        ma_don_vi: '',
        vai_tro: 'VIEN_CHUC',
        trang_thai: true,
        // Role form
        ten_vai_tro: '',
        mo_ta: '',
        trang_thai_role: true,
        // Permission form
        ten_quyen: '',
        mo_ta_quyen: '',
        module: '',
        action: '',
        // Assignment forms
        selectedUser: '',
        selectedRole: '',
        selectedPermission: '',
        selectedPosition: '',
        ngay_gan: new Date().toISOString().split('T')[0],
        ngay_het_hieu_luc: '',
        ghi_chu: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const tabs = [
        { id: 'users', label: 'Tài khoản', icon: FaUsers },
        { id: 'roles', label: 'Vai trò', icon: FaUserTag },
        { id: 'permissions', label: 'Quyền', icon: FaShieldAlt },
        { id: 'user-roles', label: 'Gán vai trò', icon: FaLink },
        { id: 'role-permissions', label: 'Gán quyền', icon: FaLink },
        { id: 'position-roles', label: 'Tự động gán', icon: FaMagic }
    ];

    const roleOptions = [
        { value: 'VIEN_CHUC', label: 'Viên chức' },
        { value: 'TRUONG_DON_VI', label: 'Trưởng đơn vị' },
        { value: 'CHI_BO', label: 'Chi bộ' },
        { value: 'DANG_UY', label: 'Đảng ủy' },
        { value: 'TCHC', label: 'Phòng TC-HC' },
        { value: 'BGH', label: 'Ban Giám hiệu' }
    ];

    const departmentOptions = [
        { value: 'CNTT', label: 'Công nghệ thông tin' },
        { value: 'KT', label: 'Kinh tế' },
        { value: 'NN', label: 'Ngoại ngữ' },
        { value: 'KTTC', label: 'Kế toán tài chính' }
    ];

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'users':
                    await loadUsers();
                    break;
                case 'roles':
                    await loadRoles();
                    break;
                case 'permissions':
                    await loadPermissions();
                    break;
                case 'user-roles':
                    await loadUserRoles();
                    break;
                case 'role-permissions':
                    await loadRolePermissions();
                    break;
                case 'position-roles':
                    await loadPositionRoles();
                    await loadPositions();
                    break;
                default:
                    break;
            }
        } catch (err) {
            setError('Không thể tải dữ liệu');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        const response = await api.get('/users');
        const result = await api.parseResponse(response);
        if (result.ok && result.data.success) {
            setUsers(result.data.data);
        } else {
            throw new Error(result.data?.message || 'Không thể tải danh sách người dùng');
        }
    };

    const loadRoles = async () => {
        const response = await api.get('/roles');
        const result = await api.parseResponse(response);
        if (result.ok && result.data.success) {
            setRoles(result.data.data);
        } else {
            throw new Error(result.data?.message || 'Không thể tải danh sách vai trò');
        }
    };

    const loadPermissions = async () => {
        const response = await api.get('/permissions');
        const result = await api.parseResponse(response);
        if (result.ok && result.data.success) {
            setPermissions(result.data.data);
        } else {
            throw new Error(result.data?.message || 'Không thể tải danh sách quyền');
        }
    };

    const loadUserRoles = async () => {
        const response = await api.get('/user-roles');
        const result = await api.parseResponse(response);
        if (result.ok && result.data.success) {
            setUserRoles(result.data.data);
        } else {
            throw new Error(result.data?.message || 'Không thể tải danh sách gán vai trò');
        }
    };

    const loadRolePermissions = async () => {
        const response = await api.get('/role-permissions');
        const result = await api.parseResponse(response);
        if (result.ok && result.data.success) {
            setRolePermissions(result.data.data);
        } else {
            throw new Error(result.data?.message || 'Không thể tải danh sách gán quyền');
        }
    };

    const loadPositionRoles = async () => {
        const response = await api.get('/position-roles');
        const result = await api.parseResponse(response);
        if (result.ok && result.data.success) {
            setPositionRoles(result.data.data);
        } else {
            throw new Error(result.data?.message || 'Không thể tải danh sách tự động gán');
        }
    };

    const loadPositions = async () => {
        const response = await api.get('/position-roles/positions');
        const result = await api.parseResponse(response);
        if (result.ok && result.data.success) {
            setPositions(result.data.data);
        } else {
            throw new Error(result.data?.message || 'Không thể tải danh sách chức vụ');
        }
    };

    const handleAdd = () => {
        setEditingUser(null);
        setEditingRole(null);
        setEditingPermission(null);
        resetFormData();
        setShowModal(true);
    };

    const resetFormData = () => {
        setFormData({
            mavc: '',
            ten_dang_nhap: '',
            email: '',
            ho_ten: '',
            chuc_vu: '',
            ma_don_vi: '',
            vai_tro: 'VIEN_CHUC',
            trang_thai: true,
            ten_vai_tro: '',
            mo_ta: '',
            trang_thai_role: true,
            ten_quyen: '',
            mo_ta_quyen: '',
            module: '',
            action: '',
            selectedUser: '',
            selectedRole: '',
            selectedPermission: '',
            selectedPosition: '',
            ngay_gan: new Date().toISOString().split('T')[0],
            ngay_het_hieu_luc: '',
            ghi_chu: ''
        });
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            mavc: user.mavc,
            ten_dang_nhap: user.ten_dang_nhap,
            email: user.email,
            ho_ten: user.ho_ten,
            chuc_vu: user.chuc_vu,
            ma_don_vi: user.ma_don_vi,
            vai_tro: user.vai_tro,
            trang_thai: user.trang_thai
        });
        setShowModal(true);
    };

    const handleEditRole = (role) => {
        setEditingRole(role);
        setFormData({
            ten_vai_tro: role.ten_vai_tro,
            mo_ta: role.mo_ta,
            trang_thai_role: role.trang_thai
        });
        setShowModal(true);
    };

    const handleEditPermission = (permission) => {
        setEditingPermission(permission);
        setFormData({
            ten_quyen: permission.ten_quyen,
            mo_ta_quyen: permission.mo_ta,
            module: permission.module,
            action: permission.action
        });
        setShowModal(true);
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Bạn có chắc muốn xóa người dùng ${user.ho_ten}?`)) {
            return;
        }

        try {
            await api.delete(`/users/${user.mavc}`);
            loadUsers();
        } catch (err) {
            setError('Không thể xóa người dùng');
            console.error('Error deleting user:', err);
        }
    };

    const handleDeleteRole = async (role) => {
        if (!window.confirm(`Bạn có chắc muốn xóa vai trò ${role.ten_vai_tro}?`)) {
            return;
        }

        try {
            await api.delete(`/roles/${role.ma_vai_tro}`);
            loadRoles();
        } catch (err) {
            setError('Không thể xóa vai trò');
            console.error('Error deleting role:', err);
        }
    };

    const handleDeletePermission = async (permission) => {
        if (!window.confirm(`Bạn có chắc muốn xóa quyền ${permission.ten_quyen}?`)) {
            return;
        }

        try {
            await api.delete(`/permissions/${permission.ma_quyen}`);
            loadPermissions();
        } catch (err) {
            setError('Không thể xóa quyền');
            console.error('Error deleting permission:', err);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await api.patch(`/users/${user.mavc}/status`);
            loadUsers();
        } catch (err) {
            setError('Không thể cập nhật trạng thái người dùng');
            console.error('Error updating user status:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            switch (activeTab) {
                case 'users':
                    await handleUserSubmit();
                    break;
                case 'roles':
                    await handleRoleSubmit();
                    break;
                case 'permissions':
                    await handlePermissionSubmit();
                    break;
                case 'user-roles':
                    await handleUserRoleSubmit();
                    break;
                case 'role-permissions':
                    await handleRolePermissionSubmit();
                    break;
                case 'position-roles':
                    await handlePositionRoleSubmit();
                    break;
                default:
                    break;
            }
            setShowModal(false);
            resetFormData();
        } catch (err) {
            setError('Không thể lưu dữ liệu');
            console.error('Error saving data:', err);
        }
    };

    const handleUserSubmit = async () => {
        if (editingUser) {
            await api.put(`/users/${editingUser.mavc}`, formData);
        } else {
            await api.post('/users', formData);
        }
        loadUsers();
    };

    const handleRoleSubmit = async () => {
        if (editingRole) {
            await api.put(`/roles/${editingRole.ma_vai_tro}`, {
                ten_vai_tro: formData.ten_vai_tro,
                mo_ta: formData.mo_ta,
                trang_thai: formData.trang_thai_role
            });
        } else {
            await api.post('/roles', {
                ten_vai_tro: formData.ten_vai_tro,
                mo_ta: formData.mo_ta,
                trang_thai: formData.trang_thai_role
            });
        }
        loadRoles();
    };

    const handlePermissionSubmit = async () => {
        if (editingPermission) {
            await api.put(`/permissions/${editingPermission.ma_quyen}`, {
                ten_quyen: formData.ten_quyen,
                mo_ta: formData.mo_ta_quyen,
                module: formData.module,
                action: formData.action
            });
        } else {
            await api.post('/permissions', {
                ten_quyen: formData.ten_quyen,
                mo_ta: formData.mo_ta_quyen,
                module: formData.module,
                action: formData.action
            });
        }
        loadPermissions();
    };

    const handleUserRoleSubmit = async () => {
        await api.post('/user-roles', {
            mavc: parseInt(formData.selectedUser),
            ma_vai_tro: parseInt(formData.selectedRole),
            ngay_gan: formData.ngay_gan,
            ngay_het_hieu_luc: formData.ngay_het_hieu_luc || null,
            ghi_chu: formData.ghi_chu
        });
        loadUserRoles();
    };

    const handleRolePermissionSubmit = async () => {
        await api.post('/role-permissions', {
            ma_vai_tro: parseInt(formData.selectedRole),
            ma_quyen: parseInt(formData.selectedPermission)
        });
        loadRolePermissions();
    };

    const handlePositionRoleSubmit = async () => {
        await api.post('/position-roles', {
            ma_chuc_vu: parseInt(formData.selectedPosition),
            ma_vai_tro: parseInt(formData.selectedRole)
        });
        loadPositionRoles();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return renderUsersTable();
            case 'roles':
                return renderRolesTable();
            case 'permissions':
                return renderPermissionsTable();
            case 'user-roles':
                return renderUserRolesTable();
            case 'role-permissions':
                return renderRolePermissionsTable();
            case 'position-roles':
                return renderPositionRolesTable();
            default:
                return null;
        }
    };

    const renderUsersTable = () => {
        const paginatedUsers = users.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        const totalPages = Math.ceil(users.length / itemsPerPage);

        return (
            <>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Mã VC</th>
                            <th style={styles.th}>Tên đăng nhập</th>
                            <th style={styles.th}>Họ tên</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Chức vụ</th>
                            <th style={styles.th}>Đơn vị</th>
                            <th style={styles.th}>Vai trò</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user.mavc}>
                                <td style={styles.td}>{user.mavc}</td>
                                <td style={styles.td}>{user.ten_dang_nhap}</td>
                                <td style={styles.td}>{user.ho_ten}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.chuc_vu}</td>
                                <td style={styles.td}>{user.ma_don_vi}</td>
                                <td style={styles.td}>
                                    {roleOptions.find(r => r.value === user.vai_tro)?.label}
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        color: user.trang_thai ? 'green' : 'red',
                                        fontWeight: 'bold'
                                    }}>
                                        {user.trang_thai ? 'Hoạt động' : 'Vô hiệu'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button
                                        style={{...styles.actionButton, ...styles.editButton}}
                                        onClick={() => handleEditUser(user)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        style={{...styles.actionButton, ...styles.statusButton}}
                                        onClick={() => handleToggleStatus(user)}
                                    >
                                        {user.trang_thai ? <FaUserTimes /> : <FaUserCheck />}
                                    </button>
                                    <button
                                        style={{...styles.actionButton, ...styles.deleteButton}}
                                        onClick={() => handleDeleteUser(user)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                style={{
                                    ...styles.pageButton,
                                    ...(page === currentPage ? styles.activePage : {})
                                }}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            style={styles.pageButton}
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </>
        );
    };

    const renderRolesTable = () => (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Mã vai trò</th>
                    <th style={styles.th}>Tên vai trò</th>
                    <th style={styles.th}>Mô tả</th>
                    <th style={styles.th}>Trạng thái</th>
                    <th style={styles.th}>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {roles.map((role) => (
                    <tr key={role.ma_vai_tro}>
                        <td style={styles.td}>{role.ma_vai_tro}</td>
                        <td style={styles.td}>{role.ten_vai_tro}</td>
                        <td style={styles.td}>{role.mo_ta}</td>
                        <td style={styles.td}>
                            <span style={{
                                color: role.trang_thai ? 'green' : 'red',
                                fontWeight: 'bold'
                            }}>
                                {role.trang_thai ? 'Hoạt động' : 'Vô hiệu'}
                            </span>
                        </td>
                        <td style={styles.td}>
                            <button
                                style={{...styles.actionButton, ...styles.editButton}}
                                onClick={() => handleEditRole(role)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                style={{...styles.actionButton, ...styles.deleteButton}}
                                onClick={() => handleDeleteRole(role)}
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderPermissionsTable = () => (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Mã quyền</th>
                    <th style={styles.th}>Tên quyền</th>
                    <th style={styles.th}>Module</th>
                    <th style={styles.th}>Action</th>
                    <th style={styles.th}>Mô tả</th>
                    <th style={styles.th}>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {permissions.map((permission) => (
                    <tr key={permission.ma_quyen}>
                        <td style={styles.td}>{permission.ma_quyen}</td>
                        <td style={styles.td}>{permission.ten_quyen}</td>
                        <td style={styles.td}>{permission.module}</td>
                        <td style={styles.td}>{permission.action}</td>
                        <td style={styles.td}>{permission.mo_ta}</td>
                        <td style={styles.td}>
                            <button
                                style={{...styles.actionButton, ...styles.editButton}}
                                onClick={() => handleEditPermission(permission)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                style={{...styles.actionButton, ...styles.deleteButton}}
                                onClick={() => handleDeletePermission(permission)}
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderUserRolesTable = () => (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Người dùng</th>
                    <th style={styles.th}>Vai trò</th>
                    <th style={styles.th}>Ngày gán</th>
                    <th style={styles.th}>Ngày hết hiệu lực</th>
                    <th style={styles.th}>Ghi chú</th>
                    <th style={styles.th}>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {userRoles.map((userRole) => (
                    <tr key={`${userRole.mavc}-${userRole.ma_vai_tro}-${userRole.ngay_gan}`}>
                        <td style={styles.td}>{userRole.ten_dang_nhap}</td>
                        <td style={styles.td}>{userRole.ten_vai_tro}</td>
                        <td style={styles.td}>{userRole.ngay_gan}</td>
                        <td style={styles.td}>{userRole.ngay_het_hieu_luc || 'Vĩnh viễn'}</td>
                        <td style={styles.td}>{userRole.ghi_chu}</td>
                        <td style={styles.td}>
                            <button
                                style={{...styles.actionButton, ...styles.deleteButton}}
                                onClick={() => {
                                    // Handle remove user role
                                }}
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderRolePermissionsTable = () => (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Vai trò</th>
                    <th style={styles.th}>Quyền</th>
                    <th style={styles.th}>Module</th>
                    <th style={styles.th}>Action</th>
                    <th style={styles.th}>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {rolePermissions.map((rp) => (
                    <tr key={`${rp.ma_vai_tro}-${rp.ma_quyen}`}>
                        <td style={styles.td}>{rp.ten_vai_tro}</td>
                        <td style={styles.td}>{rp.ten_quyen}</td>
                        <td style={styles.td}>{rp.module}</td>
                        <td style={styles.td}>{rp.action}</td>
                        <td style={styles.td}>
                            <button
                                style={{...styles.actionButton, ...styles.deleteButton}}
                                onClick={() => {
                                    // Handle remove role permission
                                }}
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderPositionRolesTable = () => (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Chức vụ</th>
                    <th style={styles.th}>Vai trò</th>
                    <th style={styles.th}>Mô tả</th>
                    <th style={styles.th}>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {positionRoles.map((pr) => (
                    <tr key={`${pr.ma_chuc_vu}-${pr.ma_vai_tro}`}>
                        <td style={styles.td}>{pr.ten_chuc_vu}</td>
                        <td style={styles.td}>{pr.ten_vai_tro}</td>
                        <td style={styles.td}>{pr.mo_ta_vai_tro}</td>
                        <td style={styles.td}>
                            <button
                                style={{...styles.actionButton, ...styles.deleteButton}}
                                onClick={() => {
                                    // Handle remove position role
                                }}
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderModal = () => {
        if (!showModal) return null;

        return (
            <div style={styles.modal}>
                <div style={styles.modalContent}>
                    <h3>{getModalTitle()}</h3>
                    <form onSubmit={handleSubmit}>
                        {renderModalContent()}
                        <div style={styles.buttonGroup}>
                            <button type="button" style={styles.cancelButton} onClick={() => setShowModal(false)}>
                                Hủy
                            </button>
                            <button type="submit" style={styles.submitButton}>
                                {getSubmitButtonText()}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const getModalTitle = () => {
        switch (activeTab) {
            case 'users':
                return editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới';
            case 'roles':
                return editingRole ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới';
            case 'permissions':
                return editingPermission ? 'Chỉnh sửa quyền' : 'Thêm quyền mới';
            case 'user-roles':
                return 'Gán vai trò cho người dùng';
            case 'role-permissions':
                return 'Gán quyền cho vai trò';
            case 'position-roles':
                return 'Tự động gán vai trò cho chức vụ';
            default:
                return '';
        }
    };

    const getSubmitButtonText = () => {
        switch (activeTab) {
            case 'users':
                return editingUser ? 'Cập nhật' : 'Thêm';
            case 'roles':
                return editingRole ? 'Cập nhật' : 'Thêm';
            case 'permissions':
                return editingPermission ? 'Cập nhật' : 'Thêm';
            default:
                return 'Thêm';
        }
    };

    const renderModalContent = () => {
        switch (activeTab) {
            case 'users':
                return renderUserForm();
            case 'roles':
                return renderRoleForm();
            case 'permissions':
                return renderPermissionForm();
            case 'user-roles':
                return renderUserRoleForm();
            case 'role-permissions':
                return renderRolePermissionForm();
            case 'position-roles':
                return renderPositionRoleForm();
            default:
                return null;
        }
    };

    const renderUserForm = () => (
        <>
            <div style={styles.formGroup}>
                <label style={styles.label}>Mã viên chức</label>
                <input
                    type="text"
                    name="mavc"
                    value={formData.mavc}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tên đăng nhập</label>
                <input
                    type="text"
                    name="ten_dang_nhap"
                    value={formData.ten_dang_nhap}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Họ tên</label>
                <input
                    type="text"
                    name="ho_ten"
                    value={formData.ho_ten}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Chức vụ</label>
                <input
                    type="text"
                    name="chuc_vu"
                    value={formData.chuc_vu}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Đơn vị</label>
                <select
                    name="ma_don_vi"
                    value={formData.ma_don_vi}
                    onChange={handleInputChange}
                    style={styles.select}
                >
                    <option value="">Chọn đơn vị</option>
                    {departmentOptions.map(dept => (
                        <option key={dept.value} value={dept.value}>
                            {dept.label}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Vai trò</label>
                <select
                    name="vai_tro"
                    value={formData.vai_tro}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                >
                    {roleOptions.map(role => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>
                    <input
                        type="checkbox"
                        name="trang_thai"
                        checked={formData.trang_thai}
                        onChange={handleInputChange}
                        style={styles.checkbox}
                    />
                    Hoạt động
                </label>
            </div>
        </>
    );

    const renderRoleForm = () => (
        <>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tên vai trò</label>
                <input
                    type="text"
                    name="ten_vai_tro"
                    value={formData.ten_vai_tro}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Mô tả</label>
                <textarea
                    name="mo_ta"
                    value={formData.mo_ta}
                    onChange={handleInputChange}
                    style={{...styles.input, minHeight: '80px'}}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>
                    <input
                        type="checkbox"
                        name="trang_thai_role"
                        checked={formData.trang_thai_role}
                        onChange={handleInputChange}
                        style={styles.checkbox}
                    />
                    Hoạt động
                </label>
            </div>
        </>
    );

    const renderPermissionForm = () => (
        <>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tên quyền</label>
                <input
                    type="text"
                    name="ten_quyen"
                    value={formData.ten_quyen}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Module</label>
                <input
                    type="text"
                    name="module"
                    value={formData.module}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Action</label>
                <input
                    type="text"
                    name="action"
                    value={formData.action}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Mô tả</label>
                <textarea
                    name="mo_ta_quyen"
                    value={formData.mo_ta_quyen}
                    onChange={handleInputChange}
                    style={{...styles.input, minHeight: '80px'}}
                />
            </div>
        </>
    );

    const renderUserRoleForm = () => (
        <>
            <div style={styles.formGroup}>
                <label style={styles.label}>Người dùng</label>
                <select
                    name="selectedUser"
                    value={formData.selectedUser}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                >
                    <option value="">Chọn người dùng</option>
                    {users.map(user => (
                        <option key={user.mavc} value={user.mavc}>
                            {user.ten_dang_nhap} - {user.ho_ten}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Vai trò</label>
                <select
                    name="selectedRole"
                    value={formData.selectedRole}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                >
                    <option value="">Chọn vai trò</option>
                    {roles.map(role => (
                        <option key={role.ma_vai_tro} value={role.ma_vai_tro}>
                            {role.ten_vai_tro}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Ngày gán</label>
                <input
                    type="date"
                    name="ngay_gan"
                    value={formData.ngay_gan}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Ngày hết hiệu lực</label>
                <input
                    type="date"
                    name="ngay_het_hieu_luc"
                    value={formData.ngay_het_hieu_luc}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Ghi chú</label>
                <textarea
                    name="ghi_chu"
                    value={formData.ghi_chu}
                    onChange={handleInputChange}
                    style={{...styles.input, minHeight: '80px'}}
                />
            </div>
        </>
    );

    const renderRolePermissionForm = () => (
        <>
            <div style={styles.formGroup}>
                <label style={styles.label}>Vai trò</label>
                <select
                    name="selectedRole"
                    value={formData.selectedRole}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                >
                    <option value="">Chọn vai trò</option>
                    {roles.map(role => (
                        <option key={role.ma_vai_tro} value={role.ma_vai_tro}>
                            {role.ten_vai_tro}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Quyền</label>
                <select
                    name="selectedPermission"
                    value={formData.selectedPermission}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                >
                    <option value="">Chọn quyền</option>
                    {permissions.map(permission => (
                        <option key={permission.ma_quyen} value={permission.ma_quyen}>
                            {permission.ten_quyen}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );

    const renderPositionRoleForm = () => (
        <>
            <div style={styles.formGroup}>
                <label style={styles.label}>Chức vụ</label>
                <select
                    name="selectedPosition"
                    value={formData.selectedPosition}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                >
                    <option value="">Chọn chức vụ</option>
                    {positions.map(position => (
                        <option key={position.ma_chuc_vu} value={position.ma_chuc_vu}>
                            {position.ten_chuc_vu}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Vai trò</label>
                <select
                    name="selectedRole"
                    value={formData.selectedRole}
                    onChange={handleInputChange}
                    style={styles.select}
                    required
                >
                    <option value="">Chọn vai trò</option>
                    {roles.map(role => (
                        <option key={role.ma_vai_tro} value={role.ma_vai_tro}>
                            {role.ten_vai_tro}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );

    const styles = {
        container: {
            padding: '1rem'
        },
        tabContainer: {
            display: 'flex',
            borderBottom: '1px solid #dee2e6',
            marginBottom: '1rem'
        },
        tabButton: {
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: '2px solid transparent',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            color: '#6c757d'
        },
        activeTab: {
            color: '#1e3a8a',
            borderBottomColor: '#1e3a8a',
            fontWeight: '600'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
        },
        addButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem'
        },
        th: {
            background: '#f8f9fa',
            padding: '0.75rem',
            textAlign: 'left',
            borderBottom: '2px solid #dee2e6',
            fontWeight: '600',
            fontSize: '0.85rem'
        },
        td: {
            padding: '0.75rem',
            borderBottom: '1px solid #dee2e6',
            fontSize: '0.85rem'
        },
        actionButton: {
            padding: '0.25rem 0.5rem',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            marginRight: '0.25rem'
        },
        editButton: {
            background: '#ffc107',
            color: 'white'
        },
        deleteButton: {
            background: '#dc3545',
            color: 'white'
        },
        statusButton: {
            background: '#28a745',
            color: 'white'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%'
        },
        formGroup: {
            marginBottom: '1rem'
        },
        label: {
            display: 'block',
            marginBottom: '0.25rem',
            fontWeight: '500'
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '0.9rem'
        },
        select: {
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '0.9rem'
        },
        checkbox: {
            marginRight: '0.5rem'
        },
        buttonGroup: {
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
        },
        submitButton: {
            padding: '0.5rem 1rem',
            background: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        cancelButton: {
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1rem',
            gap: '0.5rem'
        },
        pageButton: {
            padding: '0.25rem 0.5rem',
            border: '1px solid #dee2e6',
            background: 'white',
            cursor: 'pointer',
            borderRadius: '3px'
        },
        activePage: {
            background: '#1e3a8a',
            color: 'white'
        }
    };

    return (
        <MainContent title="Quản lý người dùng">
            <div style={styles.container}>
                {/* Tab Navigation */}
                <div style={styles.tabContainer}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                style={{
                                    ...styles.tabButton,
                                    ...(activeTab === tab.id ? styles.activeTab : {})
                                }}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon style={{ marginRight: '0.5rem' }} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div style={styles.header}>
                    <h3>
                        {tabs.find(tab => tab.id === activeTab)?.label}
                    </h3>
                    <button style={styles.addButton} onClick={handleAdd}>
                        <FaPlus /> Thêm
                    </button>
                </div>

                {error && (
                    <div style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div>Đang tải...</div>
                ) : (
                    <>
                        {renderTabContent()}
                    </>
                )}

                {renderModal()}
            </div>
        </MainContent>
    );
};

export default UserManagement;