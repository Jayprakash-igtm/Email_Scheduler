import React, { useEffect, useState } from 'react';

const EditPanel = ({ node, onClose, updateNodeData }) => {

  // Local state to track form values
  const [formValues, setFormValues] = useState({
    subject: '',
    body: '',
    delayTime: 24,
    delayUnit: 'hours',
    leads: []
  });
  
  // State to track raw text input for leads
  const [leadsText, setLeadsText] = useState('');

  // Initialize local state when node changes
  useEffect(() => {
    if (node) {
      const initialLeads = node.data.leads || [];
      
      setFormValues({
        subject: node.data.subject || '',
        body: node.data.body || '',
        delayTime: node.data.delayTime || 24,
        delayUnit: node.data.delayUnit || 'hours',
        leads: initialLeads
      });
      
      // Set the raw text representation of leads
      setLeadsText(Array.isArray(initialLeads) ? initialLeads.join('\n') : '');
    }
  }, [node]);

  // Handle form submission to update node data
  const handleSubmit = () => {
    // Process leads from text input
    const processedLeads = leadsText
      .split('\n')
      .map(email => email.trim())
      .filter(email => email !== '');
      
    const finalValues = {
      ...formValues,
      leads: processedLeads
    };
    
    updateNodeData(finalValues);
  };

  // Handle changes to regular form fields
  const handleChange = (field, value) => {
    const newValues = { ...formValues, [field]: value };
    setFormValues(newValues);
    
    // For immediate fields, update parent immediately
    if (field !== 'leads') {
      updateNodeData({ [field]: value });
    }
  };
  
  // Handle changes to leads textarea specifically
  const handleLeadsChange = (e) => {
    const text = e.target.value;
    setLeadsText(text);
    
    // Process leads only when applying changes to prevent processing on every keystroke
    const processedLeads = text
      .split('\n')
      .map(email => email.trim())
      .filter(email => email !== '');
      
    setFormValues(prev => ({
      ...prev,
      leads: processedLeads
    }));
  };
  

  const handleKeyDown = (e) => {
    
    if (e.key === 'Enter') {
      
      e.stopPropagation();
    }
  };

  if (!node) return null;

  return (
    <div className="bg-white shadow-lg rounded-md overflow-hidden w-[300px]">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium m-0">Edit {node.data.label}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer"
        >
          X
        </button>
      </div>

      {node.type === 'coldEmail' && (
        <div className="p-3">
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700">Subject</label>
            <input
              type="text"
              value={formValues.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Enter email subject"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700">Email Body</label>
            <textarea
              value={formValues.body}
              onChange={(e) => handleChange('body', e.target.value)}
              rows={4}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Enter email content"
            />
          </div>
        </div>
      )}

      {node.type === 'waitDelay' && (
        <div className="p-3">
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700">Delay Time</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formValues.delayTime}
                onChange={(e) => handleChange('delayTime', parseInt(e.target.value) || 1)}
                min={1}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <select
                value={formValues.delayUnit}
                onChange={(e) => handleChange('delayUnit', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {node.type === 'leadSource' && (
        <div className="p-3">
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700">Lead Emails (one per line)</label>
            <textarea
              value={leadsText}
              onChange={handleLeadsChange}
              onKeyDown={handleKeyDown}
              rows={6}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="email1@example.com
email2@example.com
email3@example.com"
              style={{
                resize: 'vertical',
                minHeight: '120px',
                lineHeight: '1.5',
                whiteSpace: 'pre',
                overflowWrap: 'break-word',
                wordBreak: 'break-all'
              }}
            />
          </div>
          
          <div className="mb-1 text-xs text-gray-600">
            {formValues.leads && Array.isArray(formValues.leads) ? 
              `${formValues.leads.length} lead(s) added` : 
              '0 leads added'}
          </div>
          
          <div className="text-xs text-blue-600">
            Press Enter to add a new email on a new line
          </div>
        </div>
      )}

      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default EditPanel;