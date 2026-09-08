'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Smartphone,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  FileText,
  RefreshCw,
  Clock,
  Sparkles,
  HardDrive,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

interface AppRelease {
  id: string;
  versionName: string;
  versionCode: number;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  releaseNotes?: string;
  isForceUpdate: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AppReleasesPage() {
  const [releases, setReleases] = useState<AppRelease[]>([]);
  const [latestRelease, setLatestRelease] = useState<AppRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [versionName, setVersionName] = useState('v1.0.12');
  const [versionCode, setVersionCode] = useState('12');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [isForceUpdate, setIsForceUpdate] = useState(false);

  // Upload progress state
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://laundry.anushatechnologies.com/api';
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || 'laundry-admin-secret-token-2026';

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch latest release
      const latestRes = await fetch(`${apiBaseUrl}/app-release/latest`, { cache: 'no-store' });
      if (latestRes.ok) {
        const json = await latestRes.json();
        if (json.success && json.data) {
          setLatestRelease(json.data);
          // Suggest next version code
          const currentCode = json.data.versionCode || 1;
          setVersionCode(String(currentCode + 1));
          // Suggest next version name if like v1.0.12 -> v1.0.13
          const match = json.data.versionName.match(/v?(\d+)\.(\d+)\.(\d+)/);
          if (match) {
            setVersionName(`v${match[1]}.${match[2]}.${parseInt(match[3], 10) + 1}`);
          }
        }
      }

      // 2. Fetch history
      const historyRes = await fetch(`${apiBaseUrl}/app-release/history`, {
        headers: { 'x-admin-token': adminToken },
        cache: 'no-store',
      });
      if (historyRes.ok) {
        const json = await historyRes.json();
        if (json.success && Array.isArray(json.data)) {
          setReleases(json.data);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load release data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, adminToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleFileSelect = (selected: File) => {
    if (!selected.name.toLowerCase().endsWith('.apk')) {
      setError('Please select a valid Android package file ending in .apk');
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || isNaN(bytes)) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an APK file to upload.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadedBytes(0);
    setTotalBytes(file.size);
    setError('');
    setNotice('');

    const queryParams = new URLSearchParams({
      versionName: versionName.trim() || 'v1.0.0',
      versionCode: versionCode.trim() || '1',
      releaseNotes: releaseNotes.trim(),
      isForceUpdate: isForceUpdate ? 'true' : 'false',
    });

    const uploadUrl = `${apiBaseUrl}/app-release/upload?${queryParams.toString()}`;

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open('POST', uploadUrl, true);
    xhr.setRequestHeader('x-admin-token', adminToken);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('x-file-name', file.name);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        setProgress(pct);
        setUploadedBytes(event.loaded);
        setTotalBytes(event.total);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.success) {
          setNotice(`🎉 APK ${versionName} published successfully! The active download link is updated.`);
          setFile(null);
          setProgress(100);
          void loadData();
          setTimeout(() => setNotice(''), 6000);
        } else {
          setError(res.message || 'Server rejected the APK upload.');
        }
      } catch {
        if (xhr.status >= 200 && xhr.status < 300) {
          setNotice('APK uploaded successfully!');
          setFile(null);
          void loadData();
        } else {
          setError(`Upload failed with status code ${xhr.status}.`);
        }
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Network connection interrupted while uploading the APK. Please check your backend connection.');
    };

    xhr.send(file);
  };

  const handleCopyLink = () => {
    const downloadUrl = `${apiBaseUrl}/app-release/download`;
    navigator.clipboard.writeText(downloadUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const directDownloadUrl = `${apiBaseUrl}/app-release/download`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Android APK & Releases Command Center
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-full">
                No cPanel / GoDaddy Needed
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload Android APKs directly to your server, auto-distribute referral download links, and manage updates.
            </p>
          </div>
        </div>

        <button
          onClick={() => void loadData()}
          disabled={loading || uploading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm font-semibold text-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Build */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Active Version</span>
            <span className="px-2 py-0.5 text-xs font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {latestRelease ? latestRelease.versionName : 'v1.0.12'}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Build #{latestRelease ? latestRelease.versionCode : '12'}</span>
            <span>•</span>
            <span>{latestRelease ? formatSize(latestRelease.fileSizeBytes) : '90.77 MB'}</span>
          </div>
        </div>

        {/* Public Direct Link */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Public Download URL</span>
            <button
              onClick={handleCopyLink}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
          <div className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            {directDownloadUrl}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <a
              href={directDownloadUrl}
              download="LaundryFresh.apk"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Test Download APK</span>
            </a>
          </div>
        </div>

        {/* Total Releases */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Releases Stored</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {releases.length > 0 ? releases.length : '1'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Releases tracked in MySQL & server storage
          </div>
        </div>
      </div>

      {/* Main Upload Zone */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Upload & Publish New APK
              </h2>
              <p className="text-xs text-slate-500">
                Directly stream your Android release APK to the server. No file manager or cPanel required.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                : file
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10'
                : 'border-slate-300 dark:border-slate-600 hover:border-orange-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".apk"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {file.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {formatSize(file.size)} • Ready for upload
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-bold underline"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    Click to browse or drag & drop your <span className="text-orange-600">.apk file</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Supports up to 150 MB (e.g. LaundryFresh.apk from Desktop)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Version Name *
              </label>
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g. v1.0.12"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Version Code (Integer Build Number) *
              </label>
              <input
                type="number"
                value={versionCode}
                onChange={(e) => setVersionCode(e.target.value)}
                placeholder="e.g. 12"
                required
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Release Notes / What's New
            </label>
            <textarea
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Added ₹50 invite reward and ₹25 welcome cash. Fixed referral deep linking on install."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="forceUpdate"
              checked={isForceUpdate}
              onChange={(e) => setIsForceUpdate(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
            />
            <label htmlFor="forceUpdate" className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
              Force Update (Customers on older versions must update before booking)
            </label>
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="space-y-2 p-4 bg-orange-50/70 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between text-xs font-bold text-orange-900 dark:text-orange-200">
                <span>Uploading {file?.name}...</span>
                <span>{progress}% ({formatSize(uploadedBytes)} / {formatSize(totalBytes)})</span>
              </div>
              <div className="w-full h-3 bg-orange-200 dark:bg-orange-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[11px] text-orange-600 dark:text-orange-400">
                Streaming directly to backend server disk. Please keep this tab open until 100%.
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !file}
            className={`w-full py-3.5 px-6 rounded-xl text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
              uploading || !file
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] shadow-orange-500/25'
            }`}
          >
            {uploading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Uploading APK ({progress}%)...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                <span>Upload & Publish {versionName}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Release History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Release History & Audit
              </h3>
              <p className="text-xs text-slate-500">
                All previously uploaded builds and version records.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-[11px] font-black uppercase text-slate-500">
                <th className="py-3.5 px-6">Version</th>
                <th className="py-3.5 px-6">Build Code</th>
                <th className="py-3.5 px-6">File Size</th>
                <th className="py-3.5 px-6">Release Notes</th>
                <th className="py-3.5 px-6">Date Uploaded</th>
                <th className="py-3.5 px-6 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {releases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No release records yet. Upload your first APK above.
                  </td>
                </tr>
              ) : (
                releases.map((rel, idx) => (
                  <tr key={rel.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-6 font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{rel.versionName}</span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full">
                          LATEST
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">
                      #{rel.versionCode}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono">
                      {formatSize(rel.fileSizeBytes)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                      {rel.releaseNotes || '—'}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {new Date(rel.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={`${apiBaseUrl}/app-release/download`}
                        download={rel.fileName || 'LaundryFresh.apk'}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
