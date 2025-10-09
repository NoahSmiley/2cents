// src/components/UpdateChecker.tsx
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export function UpdateChecker() {
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(!!window.electronAPI);

    if (!window.electronAPI) return;

    // Listen for update events
    const unsubscribeAvailable = window.electronAPI.onUpdateAvailable((info) => {
      setUpdateAvailable(true);
      setUpdateInfo(info);
      setChecking(false);
    });

    const unsubscribeDownloaded = window.electronAPI.onUpdateDownloaded((info) => {
      setDownloading(false);
      setDownloaded(true);
      setUpdateInfo(info);
    });

    return () => {
      unsubscribeAvailable();
      unsubscribeDownloaded();
    };
  }, []);

  const checkForUpdates = async () => {
    if (!window.electronAPI) return;

    setChecking(true);
    setError(null);
    
    try {
      const result = await window.electronAPI.checkForUpdates();
      
      if (result.error) {
        setError(result.error);
      } else if (result.message) {
        setError(result.message);
      } else if (!result.available) {
        setError('No updates available');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check for updates');
    } finally {
      setChecking(false);
    }
  };

  const downloadUpdate = async () => {
    if (!window.electronAPI) return;

    setDownloading(true);
    setError(null);

    try {
      const result = await window.electronAPI.downloadUpdate();
      if (!result.success) {
        setError(result.error || 'Failed to download update');
        setDownloading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to download update');
      setDownloading(false);
    }
  };

  const installUpdate = () => {
    if (!window.electronAPI) return;
    window.electronAPI.installUpdate();
  };

  if (!isElectron) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Updates</CardTitle>
          <CardDescription>Auto-updates are only available in the installed app</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Updates</CardTitle>
        <CardDescription>
          Check for updates to get the latest features and bug fixes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Check for Updates Button */}
        {!updateAvailable && !downloaded && (
          <Button
            onClick={checkForUpdates}
            disabled={checking}
            className="w-full"
          >
            {checking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking for updates...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check for Updates
              </>
            )}
          </Button>
        )}

        {/* Update Available */}
        {updateAvailable && !downloaded && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Update Available
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Version {updateInfo?.version} is ready to download
                </p>
              </div>
            </div>
            <Button
              onClick={downloadUpdate}
              disabled={downloading}
              className="w-full"
            >
              {downloading ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-bounce" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Update
                </>
              )}
            </Button>
          </div>
        )}

        {/* Update Downloaded */}
        {downloaded && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Update Ready
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Version {updateInfo?.version} has been downloaded
                </p>
              </div>
            </div>
            <Button
              onClick={installUpdate}
              className="w-full"
              variant="default"
            >
              Restart and Install
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && !updateAvailable && (
          <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
            {error}
          </div>
        )}

        {/* Current Version */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Current Version: 1.0.0
        </div>
      </CardContent>
    </Card>
  );
}
