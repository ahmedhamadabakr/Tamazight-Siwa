'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DatabaseTest() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testDatabase = async () => {
        setLoading(true);
        setResult('Testing...');

        try {
            const response = await fetch('/api/test-db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ test: true }),
            });

            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const testAuth = async () => {
        setLoading(true);
        setResult('Testing auth...');

        try {
            const response = await fetch('/api/test-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'Test123!'
                }),
            });

            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const createTestUser = async () => {
        setLoading(true);
        setResult('Creating test user...');

        try {
            const response = await fetch('/api/create-test-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'Test123!',
                    role: 'admin'
                }),
            });

            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Database & Auth Test</CardTitle>
                <CardDescription>Test database connection and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <Button onClick={testDatabase} disabled={loading}>
                        Test Database
                    </Button>
                    <Button onClick={createTestUser} disabled={loading} variant="secondary">
                        Create Test User
                    </Button>
                    <Button onClick={testAuth} disabled={loading} variant="outline">
                        Test Auth
                    </Button>
                </div>

                <div className="text-sm text-gray-600 p-2 bg-blue-50 rounded">
                    <strong>Test Credentials:</strong><br />
                    Email: test@example.com<br />
                    Password: Test123!<br />
                    Role: admin
                </div>

                {result && (
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <pre className="text-xs overflow-auto max-h-64">
                            {result}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}