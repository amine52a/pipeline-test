"""
Simple test script to verify ML Prediction API is working
"""

import requests
import json

BASE_URL = "http://localhost:8085"

def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Health check PASSED")
            return True
        else:
            print("❌ Health check FAILED")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_model_info():
    """Test model info endpoint"""
    print("\n" + "="*60)
    print("TEST 2: Model Information")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/api/ml/model-info")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Model Name: {data['model_name']}")
            print(f"F1 Score: {data['f1_score']:.4f}")
            print(f"Accuracy: {data['accuracy']:.4f}")
            print(f"AUC: {data['auc']:.4f}")
            print(f"Total Features: {data['total_features']}")
            print("✅ Model info PASSED")
            return True
        else:
            print("❌ Model info FAILED")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_prediction():
    """Test prediction endpoint"""
    print("\n" + "="*60)
    print("TEST 3: Single Prediction")
    print("="*60)
    
    # Test data - high success probability
    test_data = {
        "budget": 100000,
        "team_size": 10,
        "duration_months": 6,
        "complexity": "low",
        "client_experience": "high",
        "technology_stack": "modern",
        "team_experience_years": 10,
        "requirements_clarity": "clear",
        "stakeholder_involvement": "high",
        "risk_factors": 2
    }
    
    print("Input Data:")
    print(json.dumps(test_data, indent=2))
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/ml/predict",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("\nPrediction Result:")
            print(f"  Will Succeed: {data['prediction']['will_succeed']}")
            print(f"  Success Probability: {data['prediction']['success_probability']}%")
            print(f"  Confidence Level: {data['prediction']['confidence_level']}")
            print(f"  Risk Level: {data['prediction']['risk_level']}")
            print(f"\nRecommendation:")
            print(f"  {data['recommendation']}")
            print("\n✅ Prediction PASSED")
            return True
        else:
            print(f"❌ Prediction FAILED: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_batch_prediction():
    """Test batch prediction endpoint"""
    print("\n" + "="*60)
    print("TEST 4: Batch Prediction")
    print("="*60)
    
    # Test data - multiple projects
    test_data = {
        "projects": [
            {
                "budget": 100000,
                "team_size": 10,
                "duration_months": 6,
                "complexity": "low"
            },
            {
                "budget": 30000,
                "team_size": 3,
                "duration_months": 12,
                "complexity": "high"
            }
        ]
    }
    
    print(f"Testing {len(test_data['projects'])} projects...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/ml/batch-predict",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nTotal Projects: {data['total_projects']}")
            print("\nResults:")
            for pred in data['predictions']:
                print(f"  Project {pred['project_index']}: "
                      f"Success={pred['will_succeed']}, "
                      f"Probability={pred['success_probability']}%, "
                      f"Risk={pred['risk_level']}")
            print("\n✅ Batch prediction PASSED")
            return True
        else:
            print(f"❌ Batch prediction FAILED: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧪 ML PREDICTION SERVICE - API TESTS")
    print("="*60)
    print(f"Testing API at: {BASE_URL}")
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health()))
    results.append(("Model Info", test_model_info()))
    results.append(("Single Prediction", test_prediction()))
    results.append(("Batch Prediction", test_batch_prediction()))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print("\n" + "="*60)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
    else:
        print("⚠️  Some tests failed. Check the output above.")
    
    print("="*60)

if __name__ == "__main__":
    main()
