import { useState, useEffect } from 'react';

// Parse Settings Hook
export const useParseSettings = () => {
  const [settings, setSettings] = useState({
    language: 'auto-detect',
    outputFormat: 'json',
    enableOCR: false,
    preserveFormatting: false,
    parsingMode: 'cost-effective'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSettings = async (newSettings) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev, ...newSettings }));
      setError(null);
    } catch (err) {
      setError('Failed to update parse settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Parse settings saved:', settings);
      setError(null);
      return { success: true, message: 'Settings saved successfully' };
    } catch (err) {
      setError('Failed to save settings');
      return { success: false, message: 'Failed to save settings' };
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    updateSettings,
    saveSettings,
    loading,
    error
  };
};

// Extract Configuration Hook
export const useExtractConfig = () => {
  const [config, setConfig] = useState({
    agentType: 'basic',
    schema: null,
    validationRules: [],
    customFields: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateConfig = async (newConfig) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setConfig(prev => ({ ...prev, ...newConfig }));
      setError(null);
    } catch (err) {
      setError('Failed to update extract configuration');
    } finally {
      setLoading(false);
    }
  };

  const generateSchema = async (documentType) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate schema generation based on document type
      const mockSchema = {
        invoice: {
          fields: ['invoiceNumber', 'date', 'amount', 'vendor', 'lineItems'],
          validation: ['required_invoiceNumber', 'date_format', 'numeric_amount']
        },
        receipt: {
          fields: ['storeName', 'date', 'total', 'items', 'paymentMethod'],
          validation: ['required_storeName', 'date_format', 'numeric_total']
        }
      };
      
      const schema = mockSchema[documentType] || mockSchema.invoice;
      setConfig(prev => ({ ...prev, schema }));
      setError(null);
      return schema;
    } catch (err) {
      setError('Failed to generate schema');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    updateConfig,
    generateSchema,
    loading,
    error
  };
};

// Classification Rules Hook
export const useClassificationRules = () => {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Invoice Detection',
      conditions: ['Contains invoice number', 'Has billing details', 'Shows line items'],
      confidence: 92
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRule = async (rule) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newRule = {
        id: Date.now(),
        ...rule,
        confidence: rule.confidence || 70
      };
      setRules(prev => [...prev, newRule]);
      setError(null);
      return newRule;
    } catch (err) {
      setError('Failed to add classification rule');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRule = async (ruleId, updates) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update rule');
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (ruleId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
      setError(null);
    } catch (err) {
      setError('Failed to delete rule');
    } finally {
      setLoading(false);
    }
  };

  return {
    rules,
    addRule,
    updateRule,
    deleteRule,
    loading,
    error
  };
};

// Index Management Hook
export const useIndexManagement = () => {
  const [indexes, setIndexes] = useState([
    {
      id: 1,
      name: 'Product Catalog',
      type: 'keyword',
      documents: 15200,
      status: 'active',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 2,
      name: 'Customer Support',
      type: 'vector',
      documents: 8700,
      status: 'indexing',
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createIndex = async (indexConfig) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newIndex = {
        id: Date.now(),
        ...indexConfig,
        documents: 0,
        status: 'creating',
        lastUpdated: new Date()
      };
      setIndexes(prev => [...prev, newIndex]);
      
      // Simulate index creation process
      setTimeout(() => {
        setIndexes(prev => prev.map(index => 
          index.id === newIndex.id 
            ? { ...index, status: 'active', documents: Math.floor(Math.random() * 1000) }
            : index
        ));
      }, 3000);
      
      setError(null);
      return newIndex;
    } catch (err) {
      setError('Failed to create index');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteIndex = async (indexId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIndexes(prev => prev.filter(index => index.id !== indexId));
      setError(null);
    } catch (err) {
      setError('Failed to delete index');
    } finally {
      setLoading(false);
    }
  };

  const getIndexStats = async (indexId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock stats
      const stats = {
        averageQueryTime: Math.floor(Math.random() * 100) + 20,
        storageUsed: (Math.random() * 5).toFixed(1),
        dailyQueries: Math.floor(Math.random() * 2000) + 500
      };
      setError(null);
      return stats;
    } catch (err) {
      setError('Failed to fetch index stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    indexes,
    createIndex,
    deleteIndex,
    getIndexStats,
    loading,
    error
  };
};

// Dashboard Stats Hook
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    documentsProcessed: 1234,
    activeIndexes: 12,
    classificationAccuracy: 98.7
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock API call - stats would come from backend
        setStats({
          documentsProcessed: Math.floor(Math.random() * 10000) + 1000,
          activeIndexes: Math.floor(Math.random() * 20) + 5,
          classificationAccuracy: (Math.random() * 5 + 95).toFixed(1)
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refreshStats = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setStats({
        documentsProcessed: Math.floor(Math.random() * 10000) + 1000,
        activeIndexes: Math.floor(Math.random() * 20) + 5,
        classificationAccuracy: (Math.random() * 5 + 95).toFixed(1)
      });
      setError(null);
    } catch (err) {
      setError('Failed to refresh stats');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    refreshStats,
    loading,
    error
  };
};