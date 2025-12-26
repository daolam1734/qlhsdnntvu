import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import MainContent from '../../components/layout/MainContent';
import api from '../../services/api';

const CategoryManagement = () => {
    const [activeTab, setActiveTab] = useState('muc-dich');
    const [categories, setCategories] = useState({
        'muc-dich': [],
        'loai-chuyen-di': [],
        'quoc-gia': [],
        'trang-thai': [],
        'loai-tai-lieu': []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const categoryConfig = {
        'muc-dich': {
            title: 'Mục đích Chuyến đi',
            endpoint: '/api/dm-muc-dich',
            codeField: 'ma_muc_dich',
            fields: [
                { key: 'ma_muc_dich', label: 'Mã', type: 'text', required: false, readOnly: true },
                { key: 'ten', label: 'Tên mục đích', type: 'text', required: true },
                { key: 'mo_ta', label: 'Mô tả', type: 'textarea' }
            ]
        },
        'loai-chuyen-di': {
            title: 'Loại Chuyến đi',
            endpoint: '/api/dm-loai-chuyen-di',
            codeField: 'ma_loai_chuyen_di',
            fields: [
                { key: 'ma_loai_chuyen_di', label: 'Mã', type: 'text', required: false, readOnly: true },
                { key: 'ten', label: 'Tên loại chuyến đi', type: 'text', required: true },
                { key: 'mo_ta', label: 'Mô tả', type: 'textarea' }
            ]
        },
        'quoc-gia': {
            title: 'Quốc gia',
            endpoint: '/api/dm-quoc-gia',
            codeField: 'ma_quoc_gia',
            fields: [
                { key: 'ma_quoc_gia', label: 'Mã quốc gia', type: 'text', required: true },
                { key: 'ten', label: 'Tên quốc gia', type: 'text', required: true },
                { key: 'vung', label: 'Vùng', type: 'text' },
                { key: 'mo_ta', label: 'Mô tả', type: 'textarea' }
            ]
        },
        'trang-thai': {
            title: 'Trạng thái',
            endpoint: '/api/dm-trang-thai',
            codeField: 'ma_trang_thai',
            fields: [
                { key: 'ma_trang_thai', label: 'Mã trạng thái', type: 'text', required: false, readOnly: true },
                { key: 'ten', label: 'Tên trạng thái', type: 'text', required: true },
                { key: 'mo_ta', label: 'Mô tả', type: 'textarea' },
                { key: 'mau_sac', label: 'Màu sắc', type: 'text' }
            ]
        },
        'loai-tai-lieu': {
            title: 'Loại Tài liệu',
            endpoint: '/api/dm-loai-tai-lieu',
            codeField: 'ma_loai_tai_lieu',
            fields: [
                { key: 'ma_loai_tai_lieu', label: 'Mã loại tài liệu', type: 'text', required: false, readOnly: true },
                { key: 'ten', label: 'Tên loại tài liệu', type: 'text', required: true },
                { key: 'mo_ta', label: 'Mô tả', type: 'textarea' },
                { key: 'bat_buoc', label: 'Bắt buộc', type: 'checkbox' }
            ]
        }
    };

    const styles = {
        tabs: {
            display: 'flex',
            borderBottom: '1px solid #dee2e6',
            marginBottom: '1rem',
            overflowX: 'auto'
        },
        tab: {
            padding: '0.5rem 0.75rem',
            border: 'none',
            background: 'none',
            color: '#6c757d',
            cursor: 'pointer',
            borderBottom: '2px solid transparent',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            fontSize: '0.85rem'
        },
        activeTab: {
            color: '#1e3a8a',
            borderBottom: '2px solid #1e3a8a',
            fontWeight: '500'
        },
        tabHover: {
            color: '#1e3a8a'
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
        },
        addButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            background: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'background-color 0.2s'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        tableHeader: {
            background: '#f8f9fa',
            padding: '0.75rem',
            textAlign: 'left',
            fontWeight: '500',
            color: '#1e3a8a',
            borderBottom: '1px solid #dee2e6',
            fontSize: '0.85rem'
        },
        tableCell: {
            padding: '0.75rem',
            borderBottom: '1px solid #dee2e6',
            verticalAlign: 'middle',
            fontSize: '0.85rem',
            textAlign: 'left',
            maxWidth: '200px',
            wordWrap: 'break-word'
        },
        tableRow: {
            transition: 'background-color 0.2s'
        },
        tableRowHover: {
            backgroundColor: '#f8f9fa'
        },
        textHover: {
            cursor: 'pointer',
            transition: 'color 0.2s'
        },
        textHoverYellow: {
            color: '#ffc107'
        },
        actionButton: {
            padding: '0.25rem 0.5rem',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            marginRight: '0.25rem',
            transition: 'all 0.2s'
        },
        editButton: {
            background: '#ffc107',
            color: 'white'
        },
        deleteButton: {
            background: '#dc3545',
            color: 'white'
        },
        viewButton: {
            background: '#17a2b8',
            color: 'white'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            background: 'white',
            borderRadius: '6px',
            padding: '1.5rem',
            width: '90%',
            maxWidth: '450px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #e9ecef'
        },
        modalTitle: {
            margin: 0,
            color: '#1e3a8a',
            fontSize: '1.1rem',
            fontWeight: '500'
        },
        closeButton: {
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#6c757d',
            padding: '0.25rem',
            borderRadius: '3px',
            transition: 'background-color 0.2s'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem'
        },
        label: {
            fontWeight: '500',
            color: '#495057',
            fontSize: '0.875rem'
        },
        input: {
            padding: '0.5rem 0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '0.875rem',
            transition: 'border-color 0.2s'
        },
        textarea: {
            padding: '0.5rem 0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '0.875rem',
            minHeight: '70px',
            resize: 'vertical',
            transition: 'border-color 0.2s'
        },
        buttonGroup: {
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e9ecef'
        },
        submitButton: {
            padding: '0.5rem 1rem',
            background: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
        },
        cancelButton: {
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            padding: '1rem 0'
        },
        pageButton: {
            padding: '0.375rem 0.75rem',
            border: '1px solid #dee2e6',
            background: 'white',
            color: '#1e3a8a',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
            minWidth: '40px',
            textAlign: 'center'
        },
        activePageButton: {
            background: '#1e3a8a',
            color: 'white',
            borderColor: '#1e3a8a'
        },
        disabledPageButton: {
            background: '#f8f9fa',
            color: '#6c757d',
            cursor: 'not-allowed'
        }
    };

    useEffect(() => {
        loadCategories(activeTab);
    }, [activeTab, currentPage]);

    const loadCategories = async (tab) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/categories/${tab}`, {
                page: currentPage,
                limit: itemsPerPage,
                activeOnly: true
            });

            const result = await api.parseResponse(response);

            if (result.ok && result.data.success) {
                setCategories(prev => ({
                    ...prev,
                    [tab]: result.data.data
                }));
            } else {
                setError(result.data?.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            setError(error.response?.data?.message || 'Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        const initialData = {};
        currentConfig.fields.forEach(field => {
            if (!field.readOnly) {
                if (field.type === 'checkbox') {
                    initialData[field.key] = false;
                } else {
                    initialData[field.key] = '';
                }
            }
        });
        setFormData(initialData);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        const editData = {};
        currentConfig.fields.forEach(field => {
            if (field.type === 'checkbox') {
                editData[field.key] = item[field.key] || false;
            } else {
                editData[field.key] = item[field.key] || '';
            }
        });
        setFormData(editData);
        setShowModal(true);
    };

    const handleDelete = async (code) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
            try {
                setLoading(true);
                setError(null);

                const response = await api.delete(`/categories/${activeTab}/${code}`);
                const result = await api.parseResponse(response);

                if (result.ok && result.data.success) {
                    loadCategories(activeTab); // Reload data
                } else {
                    setError(result.data?.message || 'Không thể xóa mục này');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                setError(error.message || 'Lỗi kết nối server');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            let response;
            if (editingItem) {
                // Update API call
                response = await api.put(`/categories/${activeTab}/${editingItem[currentConfig.codeField]}`, formData);
            } else {
                // Create API call
                response = await api.post(`/categories/${activeTab}`, formData);
            }

            const result = await api.parseResponse(response);

            if (result.ok && result.data.success) {
                setShowModal(false);
                const resetData = {};
                currentConfig.fields.forEach(field => {
                    if (!field.readOnly) {
                        if (field.type === 'checkbox') {
                            resetData[field.key] = false;
                        } else {
                            resetData[field.key] = '';
                        }
                    }
                });
                setFormData(resetData);
                setEditingItem(null);
                loadCategories(activeTab); // Reload data
            } else {
                setError(result.data?.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            setError(error.response?.data?.message || 'Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const currentConfig = categoryConfig[activeTab];
    const currentCategories = categories[activeTab];

    // Pagination logic
    const totalPages = Math.ceil(currentCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = currentCategories.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                style={{
                    ...styles.pageButton,
                    ...(currentPage === 1 ? styles.disabledPageButton : {})
                }}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                onMouseEnter={(e) => {
                    if (currentPage > 1) {
                        e.target.style.background = '#f8f9fa';
                        e.target.style.borderColor = '#1e3a8a';
                    }
                }}
                onMouseLeave={(e) => {
                    if (currentPage > 1) {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#dee2e6';
                    }
                }}
                disabled={currentPage === 1}
            >
                ‹
            </button>
        );

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    style={{
                        ...styles.pageButton,
                        ...(i === currentPage ? styles.activePageButton : {})
                    }}
                    onClick={() => handlePageChange(i)}
                    onMouseEnter={(e) => {
                        if (i !== currentPage) {
                            e.target.style.background = '#f8f9fa';
                            e.target.style.borderColor = '#1e3a8a';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (i !== currentPage) {
                            e.target.style.background = 'white';
                            e.target.style.borderColor = '#dee2e6';
                        }
                    }}
                >
                    {i}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                style={{
                    ...styles.pageButton,
                    ...(currentPage === totalPages ? styles.disabledPageButton : {})
                }}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                onMouseEnter={(e) => {
                    if (currentPage < totalPages) {
                        e.target.style.background = '#f8f9fa';
                        e.target.style.borderColor = '#1e3a8a';
                    }
                }}
                onMouseLeave={(e) => {
                    if (currentPage < totalPages) {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#dee2e6';
                    }
                }}
                disabled={currentPage === totalPages}
            >
                ›
            </button>
        );

        return (
            <div style={styles.pagination}>
                {pages}
            </div>
        );
    };

    return (
        <MainContent title="Quản lý danh mục">
            <div style={styles.tabs}>
                {Object.entries(categoryConfig).map(([key, config]) => (
                    <button
                        key={key}
                        style={activeTab === key ? { ...styles.tab, ...styles.activeTab } : styles.tab}
                        onClick={() => setActiveTab(key)}
                        onMouseEnter={(e) => {
                            if (activeTab !== key) {
                                e.target.style.color = styles.tabHover.color;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== key) {
                                e.target.style.color = styles.tab.color;
                            }
                        }}
                    >
                        {config.title}
                    </button>
                ))}
            </div>

            <div style={styles.content}>
                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </div>
                )}

                <div style={styles.header}>
                    <h3 style={{ margin: 0, color: '#1e3a8a' }}>{currentConfig.title}</h3>
                    <button
                        style={{ ...styles.addButton, ...(loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                        onClick={handleAdd}
                        onMouseEnter={(e) => !loading && (e.target.style.background = '#152c5a')}
                        onMouseLeave={(e) => !loading && (e.target.style.background = '#1e3a8a')}
                        disabled={loading}
                    >
                        <FaPlus /> Thêm mới
                    </button>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Mã</th>
                            <th style={styles.tableHeader}>Tên</th>
                            <th style={styles.tableHeader}>Mô tả</th>
                            <th style={styles.tableHeader}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" style={{ ...styles.tableCell, textAlign: 'center', padding: '2rem' }}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ ...styles.tableCell, textAlign: 'center', padding: '2rem' }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((item) => (
                                <tr
                                    key={item[currentConfig.codeField]}
                                    style={styles.tableRow}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={styles.tableCell}>{item[currentConfig.codeField]}</td>
                                    <td
                                        style={{ ...styles.tableCell, ...styles.textHover }}
                                        onMouseEnter={(e) => e.target.style.color = styles.textHoverYellow.color}
                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                    >
                                        {item.ten}
                                    </td>
                                    <td
                                        style={{ ...styles.tableCell, ...styles.textHover }}
                                        onMouseEnter={(e) => e.target.style.color = styles.textHoverYellow.color}
                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                    >
                                        {item.mo_ta || '-'}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <button
                                            style={{ ...styles.actionButton, ...styles.viewButton }}
                                            onClick={() => handleEdit(item)}
                                            disabled={loading}
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            style={{ ...styles.actionButton, ...styles.editButton }}
                                            onClick={() => handleEdit(item)}
                                            disabled={loading}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            style={{ ...styles.actionButton, ...styles.deleteButton }}
                                            onClick={() => handleDelete(item[currentConfig.codeField])}
                                            disabled={loading}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {renderPagination()}

                {totalPages > 1 && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '0.5rem',
                        fontSize: '0.8rem',
                        color: '#6c757d'
                    }}>
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, currentCategories.length)} của {currentCategories.length} mục
                    </div>
                )}
            </div>

            {showModal && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} - {currentConfig.title}
                            </h3>
                            <button
                                style={styles.closeButton}
                                onClick={() => setShowModal(false)}
                                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.background = 'none'}
                            >
                                ×
                            </button>
                        </div>

                        <form style={styles.form} onSubmit={handleSubmit}>
                            {currentConfig.fields.map((field) => (
                                <div key={field.key} style={styles.formGroup}>
                                    <label style={styles.label}>
                                        {field.label} {field.required && <span style={{ color: '#dc3545' }}>*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            style={styles.textarea}
                                            value={formData[field.key] || ''}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                            required={field.required}
                                            readOnly={field.readOnly}
                                        />
                                    ) : field.type === 'checkbox' ? (
                                        <input
                                            type="checkbox"
                                            style={{ marginRight: '0.5rem' }}
                                            checked={formData[field.key] || false}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                                            disabled={field.readOnly}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            style={styles.input}
                                            value={formData[field.key] || ''}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                            required={field.required}
                                            readOnly={field.readOnly}
                                        />
                                    )}
                                </div>
                            ))}

                            <div style={styles.buttonGroup}>
                                <button
                                    type="button"
                                    style={styles.cancelButton}
                                    onClick={() => setShowModal(false)}
                                    onMouseEnter={(e) => e.target.style.background = '#5a6268'}
                                    onMouseLeave={(e) => e.target.style.background = '#6c757d'}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    style={{ ...styles.submitButton, ...(loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                                    onMouseEnter={(e) => !loading && (e.target.style.background = '#152c5a')}
                                    onMouseLeave={(e) => !loading && (e.target.style.background = '#1e3a8a')}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý...' : (editingItem ? 'Cập nhật' : 'Thêm mới')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainContent>
    );
};

export default CategoryManagement;