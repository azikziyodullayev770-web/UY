import 'package:flutter/material.dart';
import '../models/property_model.dart';
import '../services/admin_moderation_ai_service.dart';
import 'map_view_screen.dart';
import '../models/admin_user_model.dart';

class AdminPropertyReviewScreen extends StatefulWidget {
  final Property property;
  final AdminRole activeRole;

  const AdminPropertyReviewScreen({
    Key? key,
    required this.property,
    required this.activeRole,
  }) : super(key: key);

  @override
  State<AdminPropertyReviewScreen> createState() => _AdminPropertyReviewScreenState();
}

class _AdminPropertyReviewScreenState extends State<AdminPropertyReviewScreen> {
  final _aiService = AdminModerationAIService();
  bool _isChecking = false;
  ModerationResult? _result;

  Future<void> _runAIModeration() async {
    setState(() {
      _isChecking = true;
      _result = null;
    });

    final res = await _aiService.moderateProperty(widget.property);

    if (mounted) {
      setState(() {
        _isChecking = false;
        _result = res;
      });
    }
  }

  Color _getStatusColor() {
    if (_result == null) return Colors.grey;
    switch (_result!.status) {
      case 'APPROVE':
        return Colors.green;
      case 'REJECT':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }

  void _adminFinalAction(String choice) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Admin marked property as: $choice')),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Moderation'),
        backgroundColor: Colors.blueGrey[900],
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Target Property Information Preview
            Container(
              padding: const EdgeInsets.all(24),
              color: Colors.white,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Property Details (Raw Data)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.blueGrey)),
                  const SizedBox(height: 16),
                  Text('Title: ${widget.property.title}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text('Price: \$${widget.property.price}', style: const TextStyle(fontSize: 16, color: Colors.black87)),
                  const SizedBox(height: 8),
                  Text('Desc: ${widget.property.description}'),
                  const SizedBox(height: 16),
                  if (widget.property.address != null) ...[
                    Text('Location: ${widget.property.address}', style: const TextStyle(color: Colors.redAccent)),
                    Text('Coords: ${widget.property.latitude}, ${widget.property.longitude}'),
                  ],
                  if (widget.property.imageUrls != null && widget.property.imageUrls!.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 100,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: widget.property.imageUrls!.length,
                        itemBuilder: (context, i) => Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: Image.network(widget.property.imageUrls![i], width: 100, fit: BoxFit.cover),
                        ),
                      ),
                    )
                  ],
                ],
              ),
            ),
            
            const Divider(height: 1, thickness: 1),

            // 2. AI Moderation Check Integration
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  ElevatedButton.icon(
                    onPressed: _isChecking ? null : _runAIModeration,
                    icon: _isChecking 
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.psychology, size: 28),
                    label: const Text('🤖 AI Moderation Check', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      backgroundColor: Colors.deepPurpleAccent,
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: Colors.deepPurple[200],
                    ),
                  ),

                  if (_result != null) ...[
                    const SizedBox(height: 32),
                    const Text('AI Result & Recommendation', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.grey)),
                    const SizedBox(height: 12),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: _getStatusColor(), width: 2),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: _getStatusColor(),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  _result!.status,
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                              ),
                              const Spacer(),
                              Text(
                                'Risk: ${_result!.riskLevel}',
                                style: TextStyle(color: _result!.riskLevel == 'High' ? Colors.red : Colors.black, fontWeight: FontWeight.bold),
                              )
                            ],
                          ),
                          const SizedBox(height: 16),
                          const Text('Reason', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                          Text(_result!.reason, style: const TextStyle(fontSize: 15)),
                          const SizedBox(height: 12),
                          const Text('Notes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                          Text(_result!.notes, style: const TextStyle(fontSize: 14, fontStyle: FontStyle.italic)),
                        ],
                      ),
                    ),
                  ],

                  const SizedBox(height: 48),
                                    // 3. Admin Final Action Controls
                  if (widget.activeRole != AdminRole.moderator) ...[
                    const Text('Final Admin Action', textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            style: OutlinedButton.styleFrom(foregroundColor: Colors.red, padding: const EdgeInsets.symmetric(vertical: 16)),
                            onPressed: () => _adminFinalAction('Rejected'),
                            child: const Text('Reject & Delete'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 16)),
                            onPressed: () => _adminFinalAction('Approved'),
                            child: const Text('Approve Listing'),
                          ),
                        ),
                      ],
                    ),
                  ] else ...[
                    const SizedBox(height: 24),
                    const Center(
                      child: Text(
                        'Read-only Mode: Approval disabled for Moderators',
                        style: TextStyle(color: Colors.grey, fontStyle: FontStyle.italic),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
