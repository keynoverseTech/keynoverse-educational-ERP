import { defaultPermissions, type PermissionSet } from './permissionCheck';

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

function extractLabel(item: any): string {
  return (
    item?.name ||
    item?.label ||
    item?.menu_name ||
    item?.menuName ||
    item?.title ||
    item?.key ||
    item?.slug ||
    ''
  );
}

export function privilegesToPermissionSet(privileges: any[]): PermissionSet {
  const perms: PermissionSet = JSON.parse(JSON.stringify(defaultPermissions));

  const labels = (Array.isArray(privileges) ? privileges : [])
    .map(extractLabel)
    .map(normalizeText)
    .filter(Boolean);

  for (const label of labels) {
    if (label.includes('overview') || label.includes('dashboard')) {
      perms.overview = { ...(perms.overview || {}), view: true };
    }

    if (label.includes('registration') || label.includes('application') || label.includes('onboarding')) {
      perms.registration = { ...(perms.registration || {}), view: true };
      if (label.includes('approve')) perms.registration.approve = true;
      if (label.includes('reject') || label.includes('decline')) perms.registration.reject = true;
      if (label.includes('manage') || label.includes('edit')) perms.registration.manage = true;
    }

    if (label.includes('institute') || label.includes('institution')) {
      perms.institute = { ...(perms.institute || {}), view: true };
      if (label.includes('manage') || label.includes('edit')) perms.institute.manage = true;
      if (label.includes('suspend')) perms.institute.suspend = true;
      if (label.includes('credential') || label.includes('password') || label.includes('login')) perms.institute.view_credentials = true;
      if (label.includes('audit') || label.includes('log')) perms.institute.view_audit = true;
    }

    if (label.includes('program') || label.includes('programme') || label.includes('academic')) {
      perms.program = { ...(perms.program || {}), view: true };
      if (label.includes('assign') || label.includes('add') || label.includes('create')) perms.program.assign = true;
      if (label.includes('edit') || label.includes('update')) perms.program.edit = true;
      if (label.includes('limit') || label.includes('capacity')) perms.program.limit_students = true;
    }

    if (label.includes('finance') || label.includes('billing') || label.includes('subscription')) {
      perms.finance = { ...(perms.finance || {}), view: true };
      if (label.includes('revenue')) perms.finance.revenue = true;
      if (label.includes('create') && label.includes('plan')) perms.finance.create_plan = true;
      if (label.includes('edit') && label.includes('plan')) perms.finance.edit_plan = true;
      if (label.includes('delete') && label.includes('plan')) perms.finance.delete_plan = true;
    }

    if (label.includes('report')) {
      perms.reports = { ...(perms.reports || {}), view: true };
      if (label.includes('generate')) perms.reports.generate = true;
      if (label.includes('export') || label.includes('download')) perms.reports.export = true;
    }

    if (label.includes('config') || label.includes('configuration') || label.includes('setting')) {
      perms.config = { ...(perms.config || {}), settings: true };
      if (label.includes('module')) perms.config.modules = true;
      if (label.includes('maintenance')) perms.config.maintenance = true;
    }
  }

  return perms;
}

