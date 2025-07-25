# 🎫 Card Integration for Branch Naming

## 🎯 **Problem**
Companies use project management tools (Jira, Azure DevOps, Kanbanize, etc.) and need standardized branch naming that includes card/ticket numbers.

## ✨ **New Configuration System**

### **Main Settings**

#### **`gitflow.cardIntegration.enabled`** (default: `false`)
- 🔧 **Enables card-based branch naming**
- 🏢 **Perfect for corporate environments**

#### **`gitflow.cardIntegration.provider`** (default: `"custom"`)
- 🎯 **Pre-configured providers**: `"jira"`, `"azure"`, `"kanbanize"`, `"github"`, `"custom"`
- ⚡ **Quick setup** for popular tools

#### **`gitflow.cardIntegration.prefix`** (default: `""`)
- 📝 **Card prefix**: `"JIRA-"`, `"KANB-"`, `"AZ-"`, `"GH-"`, etc.
- 🎨 **Flexible for any tool**

#### **`gitflow.cardIntegration.format`** (default: `"{type}/{prefix}{cardNumber}-{name}"`)
- 🔧 **Template system** with placeholders:
  - `{type}` → `feature`, `task`, `hotfix`, etc.
  - `{prefix}` → Card prefix (JIRA-, etc.)
  - `{cardNumber}` → Card number (123456)
  - `{name}` → Branch description
  - `{parentFeature}` → For tasks only

#### **`gitflow.cardIntegration.validation`** (default: `"^[0-9]+$"`)
- ✅ **Regex validation** for card numbers
- 🛡️ **Prevents invalid formats**

#### **`gitflow.cardIntegration.required`** (default: `false`)
- 🔒 **Forces card number** when `true`
- 🎯 **Optional for flexibility**

## 🎨 **Pre-configured Providers**

### **Jira**
```json
{
  "gitflow.cardIntegration.provider": "jira",
  "gitflow.cardIntegration.prefix": "JIRA-",
  "gitflow.cardIntegration.format": "{type}/{prefix}{cardNumber}-{name}",
  "gitflow.cardIntegration.validation": "^[0-9]+$"
}
```
**Result**: `feature/JIRA-123456-nova-autenticacao`

### **Azure DevOps**
```json
{
  "gitflow.cardIntegration.provider": "azure",
  "gitflow.cardIntegration.prefix": "AZ-",
  "gitflow.cardIntegration.format": "{type}/{prefix}{cardNumber}-{name}",
  "gitflow.cardIntegration.validation": "^[0-9]+$"
}
```
**Result**: `feature/AZ-789012-implementar-dashboard`

### **GitHub Issues**
```json
{
  "gitflow.cardIntegration.provider": "github",
  "gitflow.cardIntegration.prefix": "GH-",
  "gitflow.cardIntegration.format": "{type}/{prefix}{cardNumber}-{name}",
  "gitflow.cardIntegration.validation": "^[0-9]+$"
}
```
**Result**: `feature/GH-345-adicionar-testes`

### **Kanbanize**
```json
{
  "gitflow.cardIntegration.provider": "kanbanize",
  "gitflow.cardIntegration.prefix": "KANB-",
  "gitflow.cardIntegration.format": "{type}/{prefix}{cardNumber}-{name}",
  "gitflow.cardIntegration.validation": "^[0-9]+$"
}
```
**Result**: `feature/KANB-567890-refatorar-api`

### **Custom Format**
```json
{
  "gitflow.cardIntegration.provider": "custom",
  "gitflow.cardIntegration.prefix": "PROJ-",
  "gitflow.cardIntegration.format": "{prefix}{cardNumber}/{type}-{name}",
  "gitflow.cardIntegration.validation": "^[A-Z]{2}[0-9]{4}$"
}
```
**Result**: `PROJ-AB1234/feature-nova-funcionalidade`

## 🔧 **Advanced Templates**

### **Task with Parent Feature**
```json
{
  "gitflow.cardIntegration.format": "{type}/{prefix}{cardNumber}-{parentFeature}/{name}"
}
```
**Result**: `task/JIRA-123456-nova-autenticacao/validar-senha`

### **Hierarchical Format**
```json
{
  "gitflow.cardIntegration.format": "{type}/{prefix}{cardNumber}/{name}"
}
```
**Result**: `feature/JIRA-123456/implementar-login`

### **Prefix-Only Format**
```json
{
  "gitflow.cardIntegration.format": "{type}/{name}-{prefix}{cardNumber}"
}
```
**Result**: `feature/implementar-login-JIRA-123456`

## 🎪 **User Interface Improvements**

### **Enhanced Input Dialog**
```
┌─────────────────────────────────────────┐
│  🎫 Create Feature Branch               │
├─────────────────────────────────────────┤
│  Card Number: [123456        ]          │
│  Description: [nova-autentic...]        │
│                                         │
│  Preview: feature/JIRA-123456-nova-au… │
│                                         │
│  [Cancel]              [Create Branch]  │
└─────────────────────────────────────────┘
```

### **Provider Quick Setup**
```
┌─────────────────────────────────────────┐
│  🔧 Setup Card Integration              │
├─────────────────────────────────────────┤
│  Provider: [Jira ▼]                     │
│  ✅ Use standard Jira format            │
│                                         │
│  Custom prefix: [JIRA-      ]           │
│                                         │
│  [Cancel]                  [Configure]  │
└─────────────────────────────────────────┘
```

## 🎯 **Configuration Examples**

### **Enterprise Setup (Required Cards)**
```json
{
  "gitflow.cardIntegration.enabled": true,
  "gitflow.cardIntegration.provider": "jira",
  "gitflow.cardIntegration.required": true,
  "gitflow.cardIntegration.validation": "^[0-9]{6}$"
}
```

### **Flexible Setup (Optional Cards)**
```json
{
  "gitflow.cardIntegration.enabled": true,
  "gitflow.cardIntegration.provider": "custom",
  "gitflow.cardIntegration.required": false,
  "gitflow.cardIntegration.prefix": "PROJ-"
}
```

### **Multi-Project Setup**
```json
{
  "gitflow.cardIntegration.enabled": true,
  "gitflow.cardIntegration.provider": "custom",
  "gitflow.cardIntegration.prefix": "TEAM-",
  "gitflow.cardIntegration.format": "{prefix}{cardNumber}/{type}-{name}",
  "gitflow.cardIntegration.validation": "^(FRONT|BACK|API)-[0-9]{4}$"
}
```

## 🌟 **Benefits**

1. **🏢 Corporate Compliance**: Follows company standards
2. **⚡ Quick Setup**: Pre-configured providers
3. **🎨 Flexibility**: Custom formats and validation
4. **✅ Validation**: Prevents naming errors
5. **👥 Team Consistency**: Standardized across team
6. **📊 Traceability**: Links branches to cards/tickets
7. **🔧 Easy Configuration**: User-friendly setup

## 🎪 **Advanced Features**

### **Auto-increment Card Numbers**
```json
{
  "gitflow.cardIntegration.autoIncrement": true,
  "gitflow.cardIntegration.lastCardNumber": 123456
}
```

### **Card URL Integration**
```json
{
  "gitflow.cardIntegration.urlTemplate": "https://company.atlassian.net/browse/{prefix}{cardNumber}",
  "gitflow.cardIntegration.openCardOnCreate": true
}
```

### **Branch Description from Card**
```json
{
  "gitflow.cardIntegration.fetchDescription": true,
  "gitflow.cardIntegration.apiEndpoint": "https://api.company.com/cards/{cardNumber}"
}
```

---
**Transform your development workflow with professional card integration! 🎉**
